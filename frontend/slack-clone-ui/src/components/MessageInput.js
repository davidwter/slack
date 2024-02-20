import React, { useState } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


// Ensure your API function for posting a message is correctly imported
// import { postAMessage } from '../api';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async (event) => {
    event.preventDefault(); // Prevent the default form submit action

    if (message.trim()) {
      onSendMessage(message); // Propagate the send message action
      setMessage(''); // Clear the input field after sending the message
    }
  };

  return (
    <Paper component="form" onSubmit={handleSendMessage} sx={{
      position: 'sticky',
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      padding: '2px 4px',
      margin: '20px',
    }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        multiline
        maxRows={4}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="send">
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default MessageInput;
