const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Channel = require('./models/Channel');
const Services = require('./services/verificationService');

dotenv.config();
const app = express();
app.use(express.json());

const dbConnectionURI = process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST 
    : process.env.MONGODB_URI;

mongoose.connect(dbConnectionURI);

const authentificate = (req, res, next) => {
  const authHeader= req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')){ 
    return res.status(401).send({ error: 'Not authenticated!' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id : decoded.id};
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
    const workspaceExists = await Services.verifyWorkspaceExists(workspaceId,token);
    console.log("Workspace exists : "+workspaceExists);
    if (!workspaceExists){
        return res.status(401).send({ error: 'No workspace found!' });
        }
    const userIsMember = await Services.verifyUserIsMemberOfWorkspace(req.user.id, workspaceId,token);
    console.log("User is member : "+userIsMember);
    if (!userIsMember){
        return res.status(401).send({ error: 'Not a member of this workspace!' });
    }
    const channel = new Channel(
      {
        name,
        workspaceId,
        members: [req.user.id]
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
    const workspaceExists = await Services.verifyWorkspaceExists(workspaceId,token);
    if (!workspaceExists){
        return res.status(401).send({ error: 'No workspace found!' });
    }
    const userIsMember = await Services.verifyUserIsMemberOfWorkspace(req.user.id, workspaceId,token);
    if (!userIsMember){
        return res.status(401).send({ error: 'Not a member of this workspace!' });
    }
    const channels = await Channel.find({workspaceId});
    res.status(200).send({ channels });
  } catch (error) {
    console.error('Error getting channels', error);
    res.status(500).send({message: 'Error getting channels!'});
  }
}
);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

