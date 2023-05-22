package websocket

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}

type Center struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
}

func NewCenter() *Center {
	return &Center{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message, 5),
	}
}

func (c *Center) Run() {
	for {
		select {
		case cl := <-c.Register:
			_, success := c.Rooms[cl.RoomID]
			if success {
				r := c.Rooms[cl.RoomID]

				_, success := r.Clients[cl.ID]
				if !success {
					r.Clients[cl.ID] = cl
				}
			}
		case cl := <-c.Unregister:
			_, success := c.Rooms[cl.RoomID]
			if success {
				_, success := c.Rooms[cl.RoomID].Clients[cl.ID]
				if success {
					if len(c.Rooms[cl.RoomID].Clients) != 0 {
						c.Broadcast <- &Message{
							Content:  "user left the chat",
							RoomID:   cl.RoomID,
							Username: cl.Username,
						}
					}

					delete(c.Rooms[cl.RoomID].Clients, cl.ID)
					close(cl.Message)
				}
			}

		case m := <-c.Broadcast:
			_, success := c.Rooms[m.RoomID]
			if success {

				for _, cl := range c.Rooms[m.RoomID].Clients {
					cl.Message <- m
				}
			}
		}
	}
}
