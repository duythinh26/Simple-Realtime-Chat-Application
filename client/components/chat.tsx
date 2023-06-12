import React from 'react'
import { Message } from '../pages/app'

const Chat = ({ data } : {data: Array<Message>}) => {
    return (
        <>
            {data.map((message: Message, index: number) => {
                if (message.type == 'receive') {
                    return (
                        <div key={index} 
                        className='flex flex-col mt-2 w-full text-right justify-end'>
                            <div className='text-sm'>{message.username}</div>
                            <div>
                                <div 
                                className='bg-blue text-white px-4 py-1 rounded-md inline-block mt-1'>
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} className='mt-2'>
                            <div className='text-sm'>{message.username}</div>
                            <div>
                                <div 
                                className='bg-grey text-secondary-black px-4 py-1 rounded-md inline-block mt-1'>
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
        </>
    )
}

export default Chat