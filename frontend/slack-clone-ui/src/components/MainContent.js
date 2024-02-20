import React , {useState, useEffect} from 'react';
import { Box, Typography, Toolbar, Divider } from '@mui/material';
import { useSelectedChannel } from '../context/SelectedChannelContext';
import { fetchMessages } from '../api';
import MessagesList from './MessagesList';

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
      <Typography variant="h6" sx={{ mb: 2 }}>
        Messages in {currentChannelName}
      </Typography>
      <MessagesList messages={messages} />
    </Box>
  );
};


export default MainContent;
