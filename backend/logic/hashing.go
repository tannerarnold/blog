package logic

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateRandomHash(len int64) string {
	token := make([]byte, len);
	rand.Read(token);
	return base64.URLEncoding.EncodeToString(token);
}