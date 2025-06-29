const Player = require('../models/playerModel');

// NOTE: Get player progress with enhanced statistics
const getPlayerProgress = async (userId) => {
  try {
    const player = await Player.findOne({ userId });
    return player;
  } catch (error) {
    console.error('❌ Error getting player progress:', error);
    throw error;
  }
};

// NOTE: Save player progress with enhanced statistics
const savePlayerProgress = async (data) => {
  try {
    const {
      userId,
      name,
      x,
      y,
      maxHeight,
      totalJumps,
      coinsCollected,
      gemsCollected,
      playTime,
      challengesCompleted,
      achievements,
    } = data;

    const updateData = {
      name,
      x,
      y,
      lastActive: new Date(),
    };

    // TODO: Update statistics if provided
    if (maxHeight !== undefined) updateData.maxHeight = maxHeight;
    if (totalJumps !== undefined) updateData.totalJumps = totalJumps;
    if (coinsCollected !== undefined)
      updateData.coinsCollected = coinsCollected;
    if (gemsCollected !== undefined) updateData.gemsCollected = gemsCollected;
    if (playTime !== undefined) updateData.playTime = playTime;
    if (challengesCompleted !== undefined)
      updateData.challengesCompleted = challengesCompleted;
    if (achievements !== undefined) updateData.achievements = achievements;

    const player = await Player.findOneAndUpdate({ userId }, updateData, {
      upsert: true,
      new: true,
    });

    return player;
  } catch (error) {
    console.error('❌ Error saving player progress:', error);
    throw error;
  }
};

// NOTE: Get collected items for a player
const getCollectedItems = async (userId) => {
  try {
    const player = await Player.findOne({ userId });
    return player ? player.collectedItems : [];
  } catch (error) {
    console.error('❌ Error getting collected items:', error);
    throw error;
  }
};

// NOTE: Mark an item as collected for a player
const markItemAsCollected = async (userId, itemId) => {
  try {
    const player = await Player.findOneAndUpdate(
      { userId },
      { $addToSet: { collectedItems: itemId } }, // NOTE: Use $addToSet to prevent duplicates
      { new: true }
    );
    return player;
  } catch (error) {
    console.error('❌ Error marking item as collected:', error);
    throw error;
  }
};

// NOTE: Get all players except the specified one
const getAllPlayersExcept = async (userId) => {
  try {
    const players = await Player.find({ userId: { $ne: userId } });
    return players;
  } catch (error) {
    console.error('❌ Error getting all players:', error);
    throw error;
  }
};

// NOTE: Get leaderboard data
const getLeaderboard = async (limit = 10) => {
  try {
    console.log('🏆 Getting leaderboard data...');
    const leaderboard = await Player.find()
      .sort({ maxHeight: -1, lastActive: -1 })
      .limit(limit)
      .select(
        'name maxHeight coinsCollected gemsCollected totalJumps challengesCompleted lastActive'
      );

    console.log('🏆 Raw leaderboard data:', leaderboard);

    const mappedLeaderboard = leaderboard.map((player) => ({
      name: player.name,
      height: player.maxHeight || 0,
      coins: player.coinsCollected || 0,
      gems: player.gemsCollected || 0,
      jumps: player.totalJumps || 0,
      challenges: player.challengesCompleted || 0,
      lastActive: player.lastActive,
    }));

    console.log('🏆 Mapped leaderboard data:', mappedLeaderboard);
    return mappedLeaderboard;
  } catch (error) {
    console.error('❌ Error getting leaderboard:', error);
    throw error;
  }
};

// NOTE: Get top players for real-time updates
const getTopPlayers = async (limit = 5) => {
  try {
    const topPlayers = await Player.find()
      .sort({ maxHeight: -1 })
      .limit(limit)
      .select('name maxHeight lastActive');

    return topPlayers.map((player) => ({
      name: player.name,
      height: player.maxHeight,
      lastActive: player.lastActive,
    }));
  } catch (error) {
    console.error('❌ Error getting top players:', error);
    throw error;
  }
};

// NOTE: Update player statistics
const updatePlayerStats = async (userId, stats) => {
  try {
    const player = await Player.findOneAndUpdate(
      { userId },
      {
        ...stats,
        lastActive: new Date(),
      },
      { new: true }
    );
    return player;
  } catch (error) {
    console.error('❌ Error updating player stats:', error);
    throw error;
  }
};

// NOTE: Unlock achievement for a player
const unlockAchievement = async (userId, achievementName) => {
  try {
    const player = await Player.findOneAndUpdate(
      { userId },
      { $addToSet: { achievements: achievementName } }, // NOTE: Use $addToSet to prevent duplicates
      { new: true }
    );
    return player;
  } catch (error) {
    console.error('❌ Error unlocking achievement:', error);
    throw error;
  }
};

// NOTE: Get player achievements from database
const getPlayerAchievements = async (userId) => {
  try {
    console.log('🎖️ Getting achievements for userId:', userId);
    const player = await Player.findOne({ userId });
    console.log('🎖️ Found player:', player ? 'yes' : 'no');
    console.log(
      '🎖️ Player achievements:',
      player ? player.achievements : 'no player'
    );
    return player ? player.achievements : [];
  } catch (error) {
    console.error('❌ Error getting player achievements:', error);
    throw error;
  }
};

// NOTE: Reset player progress (for collision respawn)
const resetPlayerProgress = async (userId, name) => {
  try {
    // NOTE: Get current player data to preserve jumps and play time
    const currentPlayer = await Player.findOne({ userId });
    const currentJumps = currentPlayer ? currentPlayer.totalJumps || 0 : 0;
    const currentPlayTime = currentPlayer ? currentPlayer.playTime || 0 : 0;

    const player = await Player.findOneAndUpdate(
      { userId },
      {
        name,
        x: 1000, // NOTE: Start position X
        y: 7900, // NOTE: Start position Y (ground level - 100)
        maxHeight: 0,
        totalJumps: currentJumps, // NOTE: Preserve jumps
        coinsCollected: 0,
        gemsCollected: 0,
        challengesCompleted: 0,
        playTime: currentPlayTime, // NOTE: Preserve play time
        achievements: [],
        collectedItems: [],
        lastActive: new Date(),
      },
      { upsert: true, new: true }
    );
    return player;
  } catch (error) {
    console.error('❌ Error resetting player progress:', error);
    throw error;
  }
};

module.exports = {
  getPlayerProgress,
  savePlayerProgress,
  getCollectedItems,
  markItemAsCollected,
  getAllPlayersExcept,
  getLeaderboard,
  getTopPlayers,
  updatePlayerStats,
  unlockAchievement,
  getPlayerAchievements,
  resetPlayerProgress,
};
