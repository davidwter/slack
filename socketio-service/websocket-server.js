const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: '*' // Replace with the origin(s) you want to allow
  }));
app.use(express.json());

// Create HTTP server and socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust according to your frontend setup
    methods: ["GET", "POST"]
  }
});

function broadcastMessage(channelId) {
  io.to(channelId).emit('message');
}

app.post('/channels/:channelId/messages', async (req, res) => {
    const { channelId } = req.params;
    try {
        broadcastMessage(channelId);
        res.status(201).send( 'message broadcasted' );
    } catch (error) {
        res.status(500).send({ error });
        console.log(error);
    }
    }
);


io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

 // When a user selects a channel
 socket.on('joinChannel', (channelId) => {
    // Leave any other channel room
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      if (room !== channelId && room !== socket.id) {
        socket.leave(room);
      }
    });
    // Join new channel room
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });

  // When a user leaves a channel (optional)
  socket.on('leaveChannel', (channelId) => {
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel ${channelId}`);
  });


  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
