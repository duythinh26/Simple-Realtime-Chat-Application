package websocket

type CreateRoomReq struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RoomReponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ClientResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}
