import React , {useState, useEffect, useCallback} from 'react';
import { Box, Typography, Toolbar, Divider } from '@mui/material';
import { useSelectedChannel } from '../context/SelectedChannelContext';
import { fetchMessages } from '../api';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { postAMessage } from '../api';
import { useSocket } from '../context/SocketContext';


const MainContent = () => {

  const { selectedChannel } = useSelectedChannel();
  const [messages, setMessages] = useState([]); 
  const { socket} = useSocket();

  const fetchMessagesForChannel = useCallback(async () => {
    if (selectedChannel) {
      try {
        const response = await fetchMessages(selectedChannel._id);
        console.log('Messages:', response.data.messages);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, [selectedChannel]); // Dependency array


  useEffect(() => {
    
    fetchMessagesForChannel();
  }, [fetchMessagesForChannel, selectedChannel]);

  useEffect(() => {
  
      socket.on('connect_error', (error) => {
        console.error('Failed to connect to the socket server:', error);
      }
      );

      socket.on('message', (message) => {
        console.log('Received message:', message);
        fetchMessagesForChannel();
      });
    
    return () => {
      
        socket.off('message');
      
    };
  }, [socket, fetchMessagesForChannel]);
  

  const onSendMessage = async (message) => {
    if (selectedChannel) {
      try {
        const response = await postAMessage(selectedChannel._id, message); 
        console.log('Message sent:', response.data.message);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  // Placeholder messages
  const currentChannelName = selectedChannel ? selectedChannel.name : 'No channel selected';

  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Toolbar /> {/* Offset for AppBar */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Messages in {currentChannelName}
      </Typography>
      <MessagesList messages={messages} />
      <MessageInput  onSendMessage={onSendMessage} />
    </Box>
  );
};


export default MainContent;
