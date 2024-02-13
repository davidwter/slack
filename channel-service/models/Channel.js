const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, required: true},
  members: [{ type: mongoose.Schema.Types.ObjectId }],
  // Consider how you'll implement messages. You might use references or embedded documents
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;

