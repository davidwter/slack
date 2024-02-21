import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketIOContext = createContext();

export const useSocket = () => useContext(SocketIOContext);

export const SocketIOProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io('http://localhost:3004');
    console.log('Connecting to socket server...');
    setSocket(newSocket);
    console.log('Connected to socket server');

    return () => newSocket.disconnect();
  }, []);

  const joinChannel = (channelId) => {
    if (socket) socket.emit('joinChannel', channelId);
  };

  const leaveChannel = (channelId) => {
    if (socket) socket.emit('leaveChannel', channelId);
  };

  const sendMessage = (channelId, message) => {
    if (socket) socket.emit('sendMessage', { channelId, message });
  };

  const contextValue = {
    joinChannel,
    leaveChannel,
    sendMessage,
    socket,
  };

  return (
    <SocketIOContext.Provider value={contextValue}>
      {children}
    </SocketIOContext.Provider>
  );
};
