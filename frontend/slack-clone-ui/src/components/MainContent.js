import React , {useState, useEffect} from 'react';
import { Box, Typography, Toolbar } from '@mui/material';
import { useSelectedChannel } from '../context/SelectedChannelContext';
import { fetchMessages } from '../api';

const MainContent = () => {

  const { selectedChannel } = useSelectedChannel();
  const [messages, setMessages] = useState([]); 

  useEffect(() => {
    const fetchMessagesForChannel = async () => {
      if (selectedChannel) {
        try {
          const response = await fetchMessages(selectedChannel._id);
          console.log('Messages:', response.data.messages);
          setMessages(response.data.messages);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          setMessages([]);
        }
      }
      else {
        setMessages([]);
      }
    };
    fetchMessagesForChannel();
  }, [selectedChannel]);

  // Placeholder messages
  const currentChannelName = selectedChannel ? selectedChannel.name : 'No channel selected';
  
  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Toolbar /> {/* Offset for AppBar */}
      <Typography paragraph>
        Messages from {currentChannelName}:
      </Typography>
      {Array.isArray(messages) && messages.map((message) => (
        <Typography key={message._id} paragraph>
          {`${message.userId}: ${message.content} (${message.createdAt})`}
        </Typography>
      ))}
    </Box>
  );
};

export default MainContent;
