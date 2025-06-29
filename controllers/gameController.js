const {
  getLeaderboard,
  getTopPlayers,
  getPlayerAchievements,
} = require('../services/playerService');

// NOTE: Get leaderboard API endpoint
const getLeaderboardAPI = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('❌ Error getting leaderboard:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch leaderboard' });
  }
};

// NOTE: Get top players API endpoint
const getTopPlayersAPI = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topPlayers = await getTopPlayers(limit);
    res.json({ success: true, data: topPlayers });
  } catch (error) {
    console.error('❌ Error getting top players:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch top players' });
  }
};

// NOTE: Get player achievements API endpoint
const getPlayerAchievementsAPI = async (req, res) => {
  try {
    const { userId } = req.params;
    const achievements = await getPlayerAchievements(userId);
    res.json({ success: true, data: achievements });
  } catch (error) {
    console.error('❌ Error getting player achievements:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch achievements' });
  }
};

// NOTE: Get game statistics API endpoint
const getGameStatsAPI = async (req, res) => {
  try {
    // TODO: Add more comprehensive game statistics
    const stats = {
      totalPlayers: 0, // NOTE: This would need to be implemented
      totalGamesPlayed: 0,
      averageHeight: 0,
      totalCoinsCollected: 0,
      totalGemsCollected: 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Error getting game stats:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch game stats' });
  }
};

module.exports = {
  getLeaderboardAPI,
  getTopPlayersAPI,
  getPlayerAchievementsAPI,
  getGameStatsAPI,
};
