"use client"

import React, { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type UserInfo = {
    username: string,
    id: string
}

export const AuthContext = createContext<{
    authed: boolean
    setAuthed: (auth: boolean) => void
    user: UserInfo
    setUser: (user: UserInfo) => void
}>({
    authed: false,
    setAuthed: () => {

    },
    user: {
        username: '',
        id: ''
    },
    setUser: () => {

    },
})

const AuthProvider = ({ children }: {children:React.ReactNode}) => {
    const [authed, setAuthed] = useState(false)
    const [user, setUser] = useState<UserInfo>({
        username: '',
        id: ''
    })
    const router = useRouter()

    useEffect(() => {
        const userInfo = localStorage.getItem('user_info')

        if (!userInfo) {
            if (window.location.pathname != '/signup') {
                router.push('/login')
                return 
            }
        } else {
            const user: UserInfo = JSON.parse(userInfo)
            if (user) {
                setUser({
                    username: user.username,
                    id: user.id,
                })
            }
            setAuthed(true)
        }
    }, [authed])

    return (
        <AuthContext.Provider value={{
            authed: authed,
            setAuthed: setAuthed,
            user: user,
            setUser: setUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider