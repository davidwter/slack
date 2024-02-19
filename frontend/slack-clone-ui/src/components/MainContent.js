import React from 'react';
import { Box, Typography, Toolbar } from '@mui/material';

const MainContent = () => {
  // Placeholder messages
  const messages = [
    { id: 1, author: 'User 1', content: 'Hello there!', timestamp: '10:00 AM' },
    // Add more messages
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar /> {/* Offset for the app bar */}
      {messages.map((message) => (
        <Typography key={message.id}>
          {message.author}: {message.content} ({message.timestamp})
        </Typography>
      ))}
    </Box>
  );
};

export default MainContent;
