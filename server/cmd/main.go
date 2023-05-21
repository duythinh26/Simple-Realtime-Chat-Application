package main

import (
	"fmt"
	"server/controller/user"
	"server/controller/websocket"
	"server/db"
	"server/router"
)

func main() {
	dbConn, err := db.NewDatabase()
	if err != nil {
		fmt.Printf("Couldn't initialize database connection: %s", err)
	}

	userRepo := user.NewRepository(dbConn.GetDB())
	userService := user.NewService(userRepo)
	userHandler := user.NewHandler(userService)

	center := websocket.NewCenter()
	centerHandler := websocket.NewHandler(center)

	router.InitRouter(userHandler, centerHandler)
	router.Start("0.0.0.0:8000")
}
