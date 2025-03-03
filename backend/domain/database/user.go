package database

type User struct {
	Id				int64		`json:"id"`
	Username		string		`json:"username"`
	Email			string		`json:"email"`
	DisplayName 	string		`json:"display_name"`
	PasswordHash	string		`json:"-"`
}