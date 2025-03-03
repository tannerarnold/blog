package database

import "time"

type Post struct {
	Id 			int64 		`json:"id"`
	DatePosted 	time.Time 	`json:"date_posted"`
	Title 		string 		`json:"title"`
	Slug 		string 		`json:"slug"`
	Summary		string		`json:"summary"`
	Content 	string 		`json:"content"`
	UserId		int64		`json:"user_id"`
}