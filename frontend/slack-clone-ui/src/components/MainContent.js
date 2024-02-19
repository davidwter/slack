import React from 'react';
import { Box, Typography, Toolbar } from '@mui/material';

const MainContent = () => {
  // Placeholder messages
  const messages = [
    { id: 1, author: 'User 1', content: 'Hello there!', timestamp: 'Today' },
    // Add more messages as needed
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Toolbar /> {/* Offset for AppBar */}
      <Typography paragraph>
        Selected Channel's Messages:
      </Typography>
      {messages.map((message) => (
        <Typography key={message.id} paragraph>
          {`${message.author}: ${message.content} (${message.timestamp})`}
        </Typography>
      ))}
    </Box>
  );
};

export default MainContent;
