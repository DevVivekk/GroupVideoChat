"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
export const socketContext = createContext(null);
export const useSocket = ()=>{
    const {socket} = useContext(socketContext);
    return socket;
}
export const SocketHandler = ({children})=>{
    const [socket,setSocket] = useState(null);
    useEffect(()=>{
        const connection = io("http://localhost:4000",{path:'/videosocket/socket.io',upgrade:true,secure:true,autoConnect: false,transports:["websocket","polling"],extraHeaders: {'Cache-control':'private, max-age=31536000'}})
        connection.connect();
        setSocket(connection);
        return ()=>{connection.disconnect();setSocket(null)}
    },[])
    return(
        <socketContext.Provider value={{socket}}>
        {children}
        </socketContext.Provider>
    )
}