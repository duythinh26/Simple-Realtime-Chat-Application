import autosize from 'autosize'
import { useRouter } from 'next/router'
import React, { useState, useRef, useContext, useEffect } from 'react'
import Chat from '../../components/chat'
import { API_URL } from '../../constants'
import { AuthContext } from '../../modules/auth'
import { WebsocketContext } from '../../modules/websocket'

export type Message = {
  content: string
  username: string
  client_id: string
  room_id: string
  type: 'receive' | 'self'
}

const index = () => {
  const [messages, setMessages] = useState<Array<Message>>([])
  const [users, setUsers] = useState<Array<{ username: string }>>([])
  const textarea = useRef<HTMLTextAreaElement>(null)
  const { conn } = useContext(WebsocketContext)
  const { user } = useContext(AuthContext)
  
  const router = useRouter()

  // Get clients in the room
  useEffect(() => {
    if (conn === null) {
      router.push('/')
      return
    }

    const roomId = conn.url.split('/')[5]
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/clients/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        console.log('data: ' + JSON.stringify(data))
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers()
  }, [])

  // Handle websocket connection
  useEffect(() => {
    if (textarea.current) {
      autosize(textarea.current)
    }

    if (conn === null) {
      router.push('/')
      return
    }

    conn.onmessage = (message) => {
      const msg: Message = JSON.parse(message.data)
      if (msg.content == 'A user has joined the room') {
        setUsers([...users, {
          username: msg.username
        }])
      }

      if (msg.content == 'User left the chat') {
        const deleteUser = users.filter((user) => user.username != msg.username) 
        setUsers([...deleteUser])
        setMessages([...messages, msg])
        return
      }

      if (user?.username == msg.username) {
        msg.type = 'self'
      } else {
        msg.type = 'receive'
      }

      setMessages([...messages, msg])
    }
  }, [textarea, messages, conn, users])

  const sendMessage = () => {
    if (!textarea.current?.value) {
      return
    }
    
    // Check connection
    if (conn === null) {
      router.push('/')
      return
    }

    conn.send(textarea.current.value)
    textarea.current.value = ''
  }

  return (
    <>
      <div className='flex flex-col w-full'>
        <div className='p-4 md:mx-6 mb-14'>
          <Chat data={messages} />
        </div>
        <div className='fixed bottom-0 mt-4 w-full'>
          <div className='flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md'>
            <div className='flex w-full mr-4 rounded-md border border-blue'>
              <textarea
                ref={textarea}
                placeholder='Type your message here'
                className='w-full h-10 p-2 rounded-md focus:outline-none'
                style={{ resize: 'none' }}
              />
            </div>
            <div className='flex items-center'>
              <button
                className='p-2 rounded-md bg-blue text-white' onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index