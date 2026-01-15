import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './userContext';


const SocketContext = createContext(null);


export function SocketProvider({ children}) {

  const {user}= useUser()

  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:3000', {
      withCredentials: true,  
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-user', user._id); 
    });
  console.log("uiiiiiaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdddddddddddddddddddddddddduiiiiiiiiiiiiidsa")
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}


export const useSocket = () => useContext(SocketContext);