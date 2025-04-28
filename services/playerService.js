// /services/playerService.js
const Player = require("../models/playerModel");

// Save player progress to MongoDB
const savePlayerProgress = async (data) => {
  try {
    const { userId, x, y } = data;

    // Check if the player exists
    let player = await Player.findOne({ userId });

    if (player) {
      // Update player progress
      player.x = x;
      player.y = y;
      await player.save();
      console.log(`✅ Player ${userId} progress updated.`);
    } else {
      // Create a new player if they don't exist
      player = new Player({ userId, x, y });
      await player.save();
      console.log(`✅ New player ${userId} progress saved.`);
    }
  } catch (err) {
    console.log("❌ Error saving player progress:", err);
  }
};

// Get player progress from MongoDB
const getPlayerProgress = async (userId) => {
  try {
    const player = await Player.findOne({ userId });

    if (player) {
      console.log(`✅ Retrieved player ${userId} progress.`);
      return player;
    } else {
      console.log(`❌ Player ${userId} not found.`);
      return { x: 0, y: 0 }; // Default values if player not found
    }
  } catch (err) {
    console.log("❌ Error retrieving player progress:", err);
    return { x: 0, y: 0 }; // Default values in case of error
  }
};

module.exports = {
  savePlayerProgress,
  getPlayerProgress,
};
