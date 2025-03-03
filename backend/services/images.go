package services

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"arnoldtech.dev/backend/domain/database"
	"arnoldtech.dev/backend/domain/dto"
	"arnoldtech.dev/backend/logic"
)

type ImagesService struct {
	Db *sql.DB
}

func NewImageService(db *sql.DB) *ImagesService {
	return &ImagesService{
		Db: db,
	}
}

func (s *ImagesService) AllImageLocations() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		getQuery := "SELECT file_name FROM images";
		rows, err := s.Db.Query(getQuery);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		fileNames := []string{};
		for rows.Next() {
			var fileName string;
			err = rows.Scan(&fileName)
			if (err != nil) {
				log.Println(err);
				w.WriteHeader(500);
				w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
				return;
			}
			fileNames = append(fileNames, fileName);
		}

		location, ok := os.LookupEnv("FRONTEND_URL");
		if (!ok) {
			log.Println("frontend url not found");
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		imageLocationsResponse := []dto.ImageLocationResponse{};

		for _, name := range fileNames {
			imageLocationsResponse = append(imageLocationsResponse, dto.ImageLocationResponse{
				FileName: name,
				Location: fmt.Sprintf("%s/api/images/%s", location, name),
			})
		}

		j, err := json.Marshal(imageLocationsResponse);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		w.Write(j);
	}
}

func (s *ImagesService) ImageByFileName() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fileName := r.PathValue("fileName");
		getQuery := "SELECT * FROM images WHERE file_name = ?";
		row := s.Db.QueryRow(getQuery, fileName);

		var image database.Image;
		err := row.Scan(&image.Id, &image.FileName, &image.MimeType, &image.ImageData);
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

		var imageResponse dto.ImageRequest;
		imageResponse.FileName = image.FileName;
		imageResponse.MimeType = image.MimeType;
		imageResponse.Data = base64.StdEncoding.EncodeToString(image.ImageData);

		j, err := json.Marshal(imageResponse);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		w.Write(j);
	}
}

func (s *ImagesService) CreateImage() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var imageRequest dto.ImageRequest;

		err := json.NewDecoder(r.Body).Decode(&imageRequest);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(400);
			w.Write(logic.EncodeJsonMessage(JsonDecodeErrorMessage))
			return;
		}

		location, ok := os.LookupEnv("FRONTEND_URL");
		if (!ok) {
			log.Println("frontend url not found");
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		imageData, err := base64.StdEncoding.DecodeString(imageRequest.Data);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(JsonDecodeErrorMessage))
			return;
		}

		insertQuery := "INSERT INTO images (file_name, mime_type, image_data) VALUES (?, ?, ?)"
		_, err = s.Db.Exec(insertQuery, imageRequest.FileName, imageRequest.MimeType, imageData);
		if (err != nil) {
			log.Println(err)
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		w.WriteHeader(201);
		w.Write(logic.EncodeJsonMessage(fmt.Sprintf("%s/api/images/%s", location, imageRequest.FileName)));
	}
}