const Player = require('../models/playerModel');

const savePlayerProgress = async (data) => {
  try {
    const { userId, x, y, name } = data;

    let player = await Player.findOne({ userId });

    if (player) {
      player.x = x;
      player.y = y;
      if (name !== player.name) {
        player.name = name;
      }
      await player.save();
      console.log(`✅ Player ${userId} progress updated.`);
    } else {
      player = new Player({ userId, x, y, name });
      await player.save();
      console.log(`✅ New player ${userId} progress saved.`);
    }
  } catch (err) {
    console.log('❌ Error saving player progress:', err);
  }
};

const getPlayerProgress = async (userId) => {
  try {
    const player = await Player.findOne({ userId });

    if (player) {
      console.log(`✅ Retrieved player ${userId} progress.`);
      return player;
    } else {
      console.log(`❌ Player ${userId} not found.`);
      return { x: 0, y: 0 };
    }
  } catch (err) {
    console.log('❌ Error retrieving player progress:', err);
    return { x: 0, y: 0 };
  }
};

async function getAllPlayersExcept(userId) {
  const results = await Player.find({
    userId: { $ne: userId },
  });

  return results.map((p) => ({
    userId: p.userId,
    x: p.x,
    y: p.y,
    name: p.name,
  }));
}

module.exports = {
  savePlayerProgress,
  getPlayerProgress,
  getAllPlayersExcept,
};
