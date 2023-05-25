import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { API_URL, WEBSOCKET_URL } from '../constants'
import { v4 as uuidv4} from "uuid"
import { AuthContext } from '../modules/auth'
import { WebsocketContext } from '../modules/websocket'

const index = () => {
  const [rooms, setRooms] = useState<{
    id: string,
    name: string
  }[]>([])
  const [roomName, setRoomName] = useState('')
  const { user } = useContext(AuthContext)
  const { setConn } = useContext(WebsocketContext)

  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms`, {
        method: 'GET',
      })

      const data = await res.json()
      if (res.ok) {
        setRooms(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setRoomName('')
      const res = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      })

      if (res.ok) {
        getRooms()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const joinRoom = (roomId: string) => {
    const websocket = new WebSocket(`${WEBSOCKET_URL}/rooms/${roomId}?userId=${user.id}&${user.username}`)
    if (websocket.OPEN) {
      setConn(websocket)
      router.push('/app')
      return
    }
  }
  
  return (
    <>
      <div className='my-8 px-4 md:mx-32 w-full h-full'>
        <div className='flex justify-center mt-3 p-5'>
          <input
            type='text'
            className='border border-grey p-2 rounded-md focus:outline-none focus:border-blue'
            placeholder='room name'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className='bg-blue border text-white rounded-md p-2 md:ml-4'
            onClick={submitHandler}
          >
            create room
          </button>
        </div>
        <div className='mt-6'>
          <div className='font-bold'>Available Rooms</div>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4 mt-6'>
            {rooms.map((room, index) => (
              <div
                key={index}
                className='border border-blue p-4 flex items-center rounded-md w-full'
              >
                <div className='w-full'>
                  <div className='text-sm'>Room</div>
                  <div className='text-blue font-bold text-lg'>{room.name}</div>
                </div>
                <div className=''>
                  <button
                    className='px-4 text-white bg-blue rounded-md'
                    onClick={() => joinRoom(room.id)}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default index