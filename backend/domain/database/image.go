package database

type Image struct {
	Id 			int64
	FileName	string
	MimeType	string
	ImageData	[]byte
}