const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const Services = require('./services/verificationService');
const cors = require('cors');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3004' // Replace with the origin(s) you want to allow
}));

const dbConnectionURI = process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST 
    : process.env.MONGODB_URI;

mongoose.connect(dbConnectionURI);

const authentificate = async (req, res, next) => {
  const authHeader= req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')){ 
    return res.status(401).send({ error: 'Not authenticated!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDetails = await Services.userDetails(decoded.id);
    if (!userDetails){
      return res.status(404).send({ error: 'User not found!' });
    }
    console.log("User details : "+userDetails);
    req.user = userDetails.user;
    next();
  } catch (error) {
    res.status(403).send({ error: 'Invalid or expired token!' });
  }
}

app.post('/channels/:channelId/messages', authentificate, async (req, res) => {
  const {content} = req.body;
  const {channelId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header

  try {
    const channelExists = await Services.verifyChannelExists(channelId,token);
    console.log("Channel exists : "+channelExists);
    if (!channelExists){
        return res.status(401).send({ error: 'No channel found!' });
        }
    const userIsMember = await Services.verifyUserIsMemberOfChannel(req.user._id, channelId,token);
    console.log("User is member : "+userIsMember);
    if (!userIsMember){
        return res.status(401).send({ error: 'Not a member of this channel!' });
    }
    const message = new Message(
      {
        content,
        channelId,
        userId: req.user._id,
        userName: req.user.username
    }
    );
    console.log("Message : "+message);
    await message.save();
    res.status(201).send({ message });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong!' });
    }
});

app.get('/channels/:channelId/messages', authentificate, async (req, res) => {
  const {channelId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header

  try {
    const channelExists = await Services.verifyChannelExists(channelId,token);
    console.log("Channel exists : "+channelExists);
    if (!channelExists){
        return res.status(401).send({ error: 'No channel found!' });
        }
    const userIsMember = await Services.verifyUserIsMemberOfChannel(req.user._id, channelId,token);
    console.log("User is member : "+userIsMember);
    if (!userIsMember){
        return res.status(401).send({ error: 'Not a member of this channel!' });
    }
    const messages = await Message.find({"channelId":channelId})
    console.log("Messages : "+messages);
    res.send({ messages });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong!' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

