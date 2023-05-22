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
	websocketHandler := websocket.NewHandler(center)
	go center.Run()

	router.InitRouter(userHandler, websocketHandler)
	router.Start("0.0.0.0:8000")
}
