package router

import (
	"server/controller/user"
	"server/controller/websocket"

	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler, websocketHandler *websocket.Handler) {
	r = gin.Default()

	r.POST("/signup", userHandler.CreateUser)
	r.POST("/login", userHandler.Login)
	r.GET("/logout", userHandler.Logout)

	r.POST("/rooms", websocketHandler.CreateRoom)
	r.GET("/rooms/:roomId", websocketHandler.JoinRoom)
	r.GET("/rooms", websocketHandler.GetRooms)
	r.GET("/clients/:roomId", websocketHandler.GetClients)
}

func Start(addr string) error {
	return r.Run(addr)
}
