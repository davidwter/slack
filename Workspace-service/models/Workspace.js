const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    owner: mongoose.Schema.Types.ObjectId, // Reference to User
    members: [mongoose.Schema.Types.ObjectId], // References to Users
  });
  
  const Workspace = mongoose.model('Workspace', WorkspaceSchema);

  module.exports = Workspace;