package services

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"arnoldtech.dev/backend/domain/database"
	"arnoldtech.dev/backend/domain/keys"
	"arnoldtech.dev/backend/logic"
)

type PostsService struct {
	Db *sql.DB
}

func NewPostService(db *sql.DB) *PostsService {
	return &PostsService{
		Db: db,
	}
}

func (s *PostsService) AllPosts() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		getQuery := "SELECT * FROM posts";
		rows, err := s.Db.Query(getQuery);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		posts := []database.Post{};
		for rows.Next() {
			var post database.Post;
			err := rows.Scan(&post.Id, &post.DatePosted, &post.Title, &post.Slug, &post.Summary, &post.Content, &post.UserId);
			if (err != nil) {
				log.Println(err);
				w.WriteHeader(500);
				w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
				return;
			}
			posts = append(posts, post)	
		}
		
		json, err := json.Marshal(posts);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		w.Write(json);
	}
}

func (s *PostsService) PostBySlug() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug");
		getQuery := "SELECT * FROM posts WHERE slug = ?";
		row := s.Db.QueryRow(getQuery, slug);

		var post database.Post;
		err := row.Scan(&post.Id, &post.DatePosted, &post.Title, &post.Slug, &post.Summary, &post.Content, &post.UserId);
		if (err != nil) {
			if (errors.Is(err, sql.ErrNoRows)) {
				w.WriteHeader(404);
				return;
			}
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		json, err := json.Marshal(post);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		w.Write(json);
	}
}

func (s *PostsService) CreatePost() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var post database.Post; 

		err := json.NewDecoder(r.Body).Decode(&post);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(400);
			w.Write(logic.EncodeJsonMessage(JsonDecodeErrorMessage));
			return;
		}
		
		userId := r.Context().Value(keys.UserIdKey{}).(int64);

		insertQuery := "INSERT INTO posts (date_posted, title, slug, summary, content, user_id) VALUES (?, ?, ?, ?, ?, ?)"
		_, err = s.Db.Exec(insertQuery, post.DatePosted, post.Title, post.Slug, post.Summary, post.Content, userId);
		if (err != nil) {
			log.Println(err)
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		location, ok := os.LookupEnv("FRONTEND_URL");
		if (!ok) {
			log.Println("frontend url not found");
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		log.Println(location);

		w.WriteHeader(201);
		w.Write(logic.EncodeJsonMessage(fmt.Sprintf("%s/blog/%s", location, post.Slug)));
	}
}