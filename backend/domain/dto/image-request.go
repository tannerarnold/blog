package dto

type ImageRequest struct {
	FileName	string	`json:"file_name"`
	MimeType	string	`json:"mime_type"`
	Data		string	`json:"data"`
}