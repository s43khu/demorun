const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    // NOTE: Enhanced player statistics
    maxHeight: {
      type: Number,
      default: 0,
    },
    totalJumps: {
      type: Number,
      default: 0,
    },
    coinsCollected: {
      type: Number,
      default: 0,
    },
    gemsCollected: {
      type: Number,
      default: 0,
    },
    playTime: {
      type: Number,
      default: 0,
    },
    challengesCompleted: {
      type: Number,
      default: 0,
    },
    // NOTE: Track collected items per user to prevent respawning
    collectedItems: {
      type: [String], // NOTE: Array of item IDs that have been collected
      default: [],
    },
    // NOTE: Store unlocked achievements
    achievements: {
      type: [String], // NOTE: Array of achievement names that have been unlocked
      default: [],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    // TODO: Add more statistics as needed
    // HACK: Using height as primary ranking metric
  },
  {
    timestamps: true,
  }
);

// NOTE: Index for efficient leaderboard queries
playerSchema.index({ maxHeight: -1 });
playerSchema.index({ lastActive: -1 });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
