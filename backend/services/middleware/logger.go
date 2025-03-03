package middleware

import (
	"log"
	"net/http"
	"time"
)

type WrappedWriter struct {
	http.ResponseWriter
	StatusCode int
}

func (w *WrappedWriter) WriteHeader(statusCode int) {
	w.ResponseWriter.WriteHeader(statusCode);
	w.StatusCode = statusCode;
}

func LoggerMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now();
		wrapped := &WrappedWriter{
			w,
			200,
		}
		next.ServeHTTP(wrapped, r);
		
		log.Println(wrapped.StatusCode, r.Method, r.URL, time.Since(start))
	})
}

