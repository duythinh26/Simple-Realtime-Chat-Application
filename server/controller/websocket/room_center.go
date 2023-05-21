package websocket

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Center struct {
	Rooms map[string]*Room
}

func NewCenter() *Center {
	return &Center{
		Rooms: make(map[string]*Room),
	}
}
