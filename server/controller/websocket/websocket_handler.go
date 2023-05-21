package websocket

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	center *Center
}

type CreateRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func NewHandler(c *Center) *Handler {
	return &Handler{
		center: c,
	}
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var req CreateRoomReq
	err := c.ShouldBindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.center.Rooms[req.ID] = &Room{
		ID:      req.ID,
		Name:    req.Name,
		Clients: make(map[string]*Client),
	}

	c.JSON(http.StatusOK, req)
}
