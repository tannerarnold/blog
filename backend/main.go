package main

import (
	"context"
	"database/sql"
	"embed"
	"log"
	"net/http"
	"os"

	"arnoldtech.dev/backend/services"
	"arnoldtech.dev/backend/services/middleware"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite3"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/reugn/go-quartz/job"
	"github.com/reugn/go-quartz/quartz"
)

//go:embed migrations/*.sql
var migrations embed.FS;

func main() {
	fileName, ok := os.LookupEnv("DATABASE_URL");
	if (!ok) {
		err := godotenv.Load();
		if (err != nil) {
			log.Fatal(err);
		}
	}

	db, err := sql.Open("sqlite3", fileName);
	if (err != nil) {
		log.Fatal(err);
	}
	
	driver, err := sqlite3.WithInstance(db, &sqlite3.Config{});
	if (err != nil) {
		log.Fatal(err);
	}

	migrationSource, err := iofs.New(migrations, "migrations");
	if (err != nil) {
		log.Fatal(err);
	}

	migrator, err := migrate.NewWithInstance("iofs", migrationSource, "database", driver);
	if (err != nil) {
		log.Fatal(err);
	}

	err = migrator.Up();
	if (err != nil && err != migrate.ErrNoChange) {
		log.Fatal(err);
	} 

	authService := services.NewAuthService(db);
	postsService := services.NewPostService(db);
	imagesService := services.NewImageService(db);

	ctx, cancel := context.WithCancel(context.Background());
	defer cancel();

	scheduler, err := quartz.NewStdScheduler();
	if (err != nil) {
		log.Fatal(err);
	} 
	scheduler.Start(ctx);

	// Every hour on the hour.
	cronTrigger, _ := quartz.NewCronTrigger("0 0 0/1 * * *");
	oldSessionJob := job.NewFunctionJob(authService.CleanupExpiredSessions);
	_ = scheduler.ScheduleJob(quartz.NewJobDetail(oldSessionJob, quartz.NewJobKey("cleanupExpiredSessions")), cronTrigger);
	
	root := http.NewServeMux();
	auth := http.NewServeMux();
	post := http.NewServeMux();
	image := http.NewServeMux();

	auth.HandleFunc("POST /", authService.AuthenticateUser());
	auth.HandleFunc("GET /{id}", authService.UserById());
	auth.HandleFunc("GET /status", authService.AuthenticationStatus());

	post.HandleFunc("GET /", postsService.AllPosts());
	post.HandleFunc("GET /{slug}", postsService.PostBySlug());
	post.Handle("POST /", middleware.AuthMiddleware(authService, postsService.CreatePost()));

	image.Handle("GET /", middleware.AuthMiddleware(authService, imagesService.AllImageLocations()));
	image.HandleFunc("GET /{fileName}", imagesService.ImageByFileName());
	image.Handle("POST /", middleware.AuthMiddleware(authService, imagesService.CreateImage()));

	root.Handle("/auth/", http.StripPrefix("/auth", auth));
	root.Handle("/posts/", http.StripPrefix("/posts", post));
	root.Handle("/images/", http.StripPrefix("/images", image));
	root.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {});

	log.Println("Server now listening...");

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", middleware.LoggerMiddleware(root)));
}