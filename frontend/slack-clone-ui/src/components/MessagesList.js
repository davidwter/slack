import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { format, isSameDay } from 'date-fns';

const MessageItem = ({ message }) => {
  const formattedDate = format(new Date(message.createdAt), 'HH:mm'); // format time to hour:minute
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
        {message.userId} {/* Display the user ID in bold */}
      </Typography>
      <Typography variant="subtitle2" component="span" sx={{ mx: 1 }}>
        {formattedDate}
      </Typography>
      <Typography variant="body1">{message.content}</Typography>
    </Box>
  );
};

const MessageGroup = ({ messages, date }) => {
  const formattedDate = format(date, 'EEEE d MMMM'); // format date to day of the week, day month
  return (
    <Box>
      <Typography variant="overline" sx={{ display: 'block', my: 2 }}>
        {formattedDate}
      </Typography>
      <Divider />
      {messages.map((message) => (
        <MessageItem key={message._id} message={message} />
      ))}
    </Box>
  );
};

const MessagesList = ({ messages }) => {
  // Group messages by day
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateStr = date.toISOString().split('T')[0]; // Get date as a string YYYY-MM-DD
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(message);
    return groups;
  }, {});

  return (
    <Box>
      {Object.entries(groupedMessages).map(([dateStr, messages]) => (
        <MessageGroup key={dateStr} date={new Date(dateStr)} messages={messages} />
      ))}
    </Box>
  );
};

export default MessagesList;
