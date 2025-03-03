package middleware

import (
	"context"
	"log"
	"net/http"

	"arnoldtech.dev/backend/domain/keys"
	"arnoldtech.dev/backend/services"
)

func AuthMiddleware(auth *services.AuthService, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

		user, csrfToken, err := auth.GetAuthenticatedUser(sessionId);
		if (err != nil) {
			log.Println(err);
			w.WriteHeader(401);
			return;
		}

		if (csrfTokenHeader != csrfToken) {
			log.Println("csrf token does not match, rejected");
			w.WriteHeader(401);
			return;
		}

		ctx := context.WithValue(r.Context(), keys.UserIdKey{}, user.Id)
		r = r.WithContext(ctx);

		next.ServeHTTP(w, r);
	})
}