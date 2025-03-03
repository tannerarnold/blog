package logic

import "encoding/json"

func EncodeJsonMessage(message string) []byte {
	j, _ := json.Marshal(message);
	return j;
}