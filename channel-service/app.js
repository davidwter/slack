const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Channel = require('./models/Channel');
const {userDetails, verifyWorkspaceExists,verifyUserIsMemberOfWorkspace} = require('./services/verificationService');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: '*' // Replace with the origin(s) you want to allow
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
    const result =  await userDetails(decoded.id);
    if (!result){
      return res.status(404).send({ error: 'User not found!' });
    }
    req.user =result.user;
    next();
  } catch (error) {
    res.status(403).send({ error: 'Invalid or expired token!' });
  }
}


app.post('/workspaces/:workspaceId/channels', authentificate, async (req, res) => {
  const {name} = req.body;
  const {workspaceId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header

  try {
    const workspaceExists = await verifyWorkspaceExists(workspaceId,token);
    console.log("Workspace exists : "+workspaceExists);
    if (!workspaceExists){
        return res.status(401).send({ error: 'No workspace found!' });
        }
    const userIsMember = await verifyUserIsMemberOfWorkspace(req.user._id, workspaceId,token);
    if (!userIsMember){
        return res.status(401).send({ error: 'Not a member of this workspace!' });
    }
    const channel = new Channel(
      {
        name,
        workspaceId,
        members: [req.user._id]
    }
    );
    console.log("Channel : "+channel);
    await channel.save();
    res.status(201).send({ channel });
    } catch (error) {
      console.error('Error creating channel', error);
        res.status(500).send({message: 'Error creating channel!'});
    }
}
);

app.get('/workspaces/:workspaceId/channels', authentificate, async (req, res) => {
  const {workspaceId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header
  try {
    const workspaceExists = await verifyWorkspaceExists(workspaceId,token);
    if (!workspaceExists){
        return res.status(401).send({ error: 'No workspace found!' });
    }
    const userIsMember = await verifyUserIsMemberOfWorkspace(req.user._id, workspaceId,token);
    if (!userIsMember && !req.user.isAdmin){
        return res.status(401).send({ error: 'Not a member of this workspace!' });
    }
    if (!req.user.isAdmin){
        const channels = await Channel.find({workspaceId, members: req.user._id});
        return res.status(200).send({ channels });
    }
    const channels = await Channel.find({workspaceId});
    res.status(200).send({ channels });
  } catch (error) {
    console.error('Error getting channels', error);
    res.status(500).send({message: 'Error getting channels!'});
  }
}
);

app.get('/channels/:channelId', authentificate, async (req, res) => {
  const {channelId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header
  try {
    const channel = await Channel.findOne({_id: channelId});
    if (!channel){
        return res.status(401).send({ error: 'No channel found!' });
    }
    if (req.user.isAdmin){
        return res.status(200).send({ channel });
    }
    if (!channel.members.includes(req.user._id)){
        return res.status(401).send({ error: 'Not a member of this channel!' });
    }
    res.status(200).send({ channel });
  } catch (error) {
    console.error('Error getting channel', error);
    res.status(500).send({message: 'Error getting channel!'});
  }
}
);

app.get('/channels/:channelId/members/:userId', authentificate, async (req, res) => {
  const {channelId, userId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header
  try {
    const channel = await Channel.findOne({_id: channelId});
    if (!channel){
        return res.status(401).send({ error: 'No channel found!' });
    }
    const isMember = channel.members.includes(userId);
    res.status(200).send({ isMember });
  } catch (error) {
    console.error('Error getting channel', error);
    res.status(500).send({message: 'Error getting channel!'});
  }
}
);

app.post('/channels/:channelId/members', authentificate, async (req, res) => {
  const {userId} = req.body;
  const {channelId} = req.params;
  const token = req.headers['authorization'].split(' ')[1]; // Extract the token from the header
  try {
    const channel = await Channel.findOne({_id: channelId});
    if (!channel){
        return res.status(401).send({ error: 'No channel found!' });
    }
    if (!channel.members.includes(userId)){
        channel.members.push(userId);
        await channel.save();
    }
    res.status(200).send({ message: 'User added to channel!' });
  } catch (error) {
    console.error('Error adding user to channel', error);
    res.status(500).send({message: 'Error adding user to channel!'});
  }
}
);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

