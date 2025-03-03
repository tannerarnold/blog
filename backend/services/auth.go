package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"arnoldtech.dev/backend/domain/database"
	"arnoldtech.dev/backend/domain/dto"
	"arnoldtech.dev/backend/logic"
	"github.com/andskur/argon2-hashing"
)

var ErrNoUserAuthenticated = errors.New("could not find session for user");

type AuthService struct {
	Db *sql.DB
}

func NewAuthService(db *sql.DB) *AuthService {
	return &AuthService{
		Db: db,
	}
}

func (s *AuthService) CleanupExpiredSessions(_ context.Context) (int64, error) {
	log.Println("cleaning old sessions");
	deleteQuery := "DELETE FROM sessions WHERE expires_at < datetime(now)";
	result, err := s.Db.Exec(deleteQuery);
	if (err != nil) {
		return 0, err;
	}
	return result.RowsAffected()
}

func (s *AuthService) GetAuthenticatedUser(sessionHash string) (*database.User, string, error) {
	getQuery := "SELECT u.*, s.csrf_token FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_hash = ?";
	row := s.Db.QueryRow(getQuery, sessionHash);
	
	var user database.User;
	var csrfToken string;
	err := row.Scan(&user.Id, &user.Username, &user.Email, &user.DisplayName, &user.PasswordHash, &csrfToken);
	if (err != nil) {
		if (errors.Is(err, sql.ErrNoRows)) {
			return nil, "", ErrNoUserAuthenticated;
		}
		return nil, "", err;
	}

	return &user, csrfToken, nil;
}

func (s *AuthService) AuthenticateUser() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest dto.LoginRequest;
	
		err := json.NewDecoder(r.Body).Decode(&loginRequest);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(400);
			w.Write(logic.EncodeJsonMessage(JsonDecodeErrorMessage))
			return;
		}
		
		getQuery := "SELECT * FROM users WHERE email = ?";
		row := s.Db.QueryRow(getQuery, loginRequest.Email);
		
		var user database.User;
		err = row.Scan(&user.Id, &user.Username, &user.Email, &user.DisplayName, &user.PasswordHash);
		if (err != nil) {
			if (errors.Is(err, sql.ErrNoRows)) {
				w.WriteHeader(400);
				w.Write(logic.EncodeJsonMessage(InvalidEmailOrPasswordMessage));
				return;
			}
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		err = argon2.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginRequest.Password));
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(400);
			w.Write(logic.EncodeJsonMessage(InvalidEmailOrPasswordMessage));
			return;
		}

		insertQuery := "INSERT INTO sessions (user_id, session_hash, csrf_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?)"
		sessionHash := logic.GenerateRandomHash(32);
		csrfToken := logic.GenerateRandomHash(32);
		
		now := time.Now();
		expiry := now.Add(time.Hour * 24);

		_, err = s.Db.Exec(insertQuery, user.Id, sessionHash, csrfToken, now, expiry);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		http.SetCookie(w, &http.Cookie{
			Name: SessionCookieName,
			Value: sessionHash,
			Path: "/",
			Expires: expiry,
			HttpOnly: true,
			Secure: true,
			SameSite: http.SameSiteNoneMode,
		})

		http.SetCookie(w, &http.Cookie{
			Name: "csrf_token",
			Value: csrfToken,
			Path: "/",
			Expires: expiry,
			HttpOnly: false,
			Secure: true,
			SameSite: http.SameSiteNoneMode,
		})

		json, err := json.Marshal(user);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		w.Write(json);
	}
}

func (s *AuthService) AuthenticationStatus() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessionId := r.Header.Get("X-Session-Id")
		if (sessionId == "") {
			log.Println("session token not included, rejected");
			w.WriteHeader(401);
			return;
		}

		csrfTokenHeader := r.Header.Get("X-CSRF-Token");
		if (csrfTokenHeader == "") {
			log.Println("csrf token not included, rejected");
			w.WriteHeader(401);
			return;
		}

		user, csrfToken, err := s.GetAuthenticatedUser(sessionId);
		if (err != nil) {
			if (errors.Is(err, ErrNoUserAuthenticated)) {
				log.Println(err);
				w.WriteHeader(401);
				return;
			}
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		if (csrfTokenHeader != csrfToken) {
			log.Println("csrf token does not match, rejected");
			w.WriteHeader(401);
			return;
		}

		j, err := json.Marshal(user);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}

		w.Write(j);
	}
}

func (s *AuthService) UserById() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"));
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(400);
			w.Write(logic.EncodeJsonMessage(InvalidPathParameterMessage));
			return;
		}
		getQuery := "SELECT * FROM users WHERE id = ?";
		row := s.Db.QueryRow(getQuery, id);

		var user database.User;
		err = row.Scan(&user.Id, &user.Username, &user.Email, &user.DisplayName, &user.PasswordHash);
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
		
		json, err := json.Marshal(user);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(500);
			w.Write(logic.EncodeJsonMessage(ServerErrorMessage));
			return;
		}
		
		w.Write(json);
	}
}