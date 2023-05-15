package main

import (
	"fmt"
	"server/db"
)

func main() {
	_, err := db.NewDatabase()
	if err != nil {
		fmt.Printf("Couldn't initialize database connection: %s", err)
	}
}
