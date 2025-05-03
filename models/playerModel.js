const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
