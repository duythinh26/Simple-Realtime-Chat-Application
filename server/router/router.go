package router

import (
	"server/controller/user"
	"server/controller/websocket"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var r *gin.Engine

func InitRouter(userHandler *user.Handler, websocketHandler *websocket.Handler) {
	r = gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:3000"
		}, MaxAge: 12 * time.Hour,
	}))

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
