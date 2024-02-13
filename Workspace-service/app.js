const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Workspace = require('./models/Workspace');
const { userExists } = require('./services/userService');

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


app.post('/workspaces', authentificate, async (req, res) => {
  const {name, description} = req.body;
  try {
    const workspace = new Workspace(
      {
        name,
        description,
        owner: req.user.id,
        members: [req.user.id]
      }
    );
    await workspace.save();
    res.status(201).send({ workspace });
  } catch (error) {
    res.status(500).send({message: 'Error creating workspace!'});
  }
});

app.get('/workspaces', authentificate, async (req, res) => {
  try {
    const workspaces = await Workspace.find({});
    if (!workspaces){
      return res.status(401).send({ error: 'no workspace!' });
    }
    res.send({ workspaces });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/workspaces/:id', authentificate, async (req, res) => {

  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace){
      return res.status(401).send({ error: 'workspace not existing!' });
    }
    res.send({ workspace });
  }
  catch (error) {
    res.status(400  
    ).send(error);
  }
}
);

app.get('/workspaces/:id/members/:member_id', authentificate, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace){
      return res.status(401).send({ error: 'workspace not existing!' });
    }
    if (!workspace.members.includes(req.params.member_id)){
      return res.status(401).send({ error: 'member not existing in this workspace!' });
    }
    res.send({ member: req.params.member_id });
  } catch (error) {
    res.status(400).send(error);
  }
}
);


app.put('/workspaces/:id', authentificate, async (req, res) => {
  const {name, description} = req.body;
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace){
      return res.status(401).send({ error: 'workspace not existing!' });
    }
    workspace.name = name;
    workspace.description = description;
    await workspace.save();
    res.send({ workspace });
  } catch (error) {
    res.status(400).send(error);
  }
}
);

app.delete('/workspaces/:id', authentificate, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace){
      return res.status(401).send({ error: 'workspace not existing!' });
    }
    await workspace.remove();
    res.send({ workspace });
  } catch (error) {
    res.status(400).send(error);
  }
} 
);

app.post('/workspaces/:workspaceId/members', authentificate, async (req, res) => {
  const {workspaceId} = req.params;
  const {userIdToAdd} = req.body;

  if (!userIdToAdd){
    return res.status(400).send({ error: 'userIdToAdd is required!' });
  }
  if (!await userExists(userIdToAdd)){
    return res.status(400).send({ error: 'userIdToAdd not existing!' });
  }
  try {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace){
      return res.status(401).send({ error: 'workspace not existing!' });
    }
    if (workspace.members.includes(userIdToAdd)) {
      return res.status(400).send({ error: 'User is already a member of this workspace!' });
    }
    workspace.members.push(userIdToAdd);
    await workspace.save();
    res.send({ workspace });
  } catch (error) {
    res.status(400).send(error);
  }
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

