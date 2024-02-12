const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Workspace = require('./models/Workspace');

dotenv.config();
const app = express();
app.use(express.json());

const dbConnectionURI = process.env.NODE_ENV === 'test' 
    ? process.env.MONGODB_URI_TEST 
    : process.env.MONGODB_URI;

mongoose.connect(dbConnectionURI);

app.post('/workspaces', async (req, res) => {
  try {
    const workspace = new Workspace(req.body);
    await workspace.save();
    res.status(201).send({ workspace });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/workspaces', async (req, res) => {
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

app.get('/workspaces/:id', async (req, res) => {

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});

