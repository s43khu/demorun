const {
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
} = require('../services/playerService');

let players = {};

// NOTE: Handle player position and stats updates
const handlePlayerUpdate = async (socket, data) => {
  console.log(`📩 Player Update from ${socket.id}:`, data);

  try {
    // NOTE: Save enhanced player data to database in real-time
    await savePlayerProgress(data);

    players[socket.id] = {
      x: data.x,
      y: data.y,
      userId: data.userId,
      name: data.name,
      maxHeight: data.maxHeight,
      totalJumps: data.totalJumps,
      coinsCollected: data.coinsCollected,
      gemsCollected: data.gemsCollected,
      playTime: data.playTime,
      challengesCompleted: data.challengesCompleted,
      achievements: data.achievements || [], // NOTE: Ensure achievements are included
    };

    // NOTE: Broadcast player sync to other players
    socket.broadcast.emit('player:sync', {
      id: socket.id,
      ...players[socket.id],
    });

    // NOTE: Always update leaderboard when player data changes
    console.log('🏆 Updating leaderboard due to player update...');
    const leaderboard = await getLeaderboard(10);

    // NOTE: Broadcast updated leaderboard to all players
    socket.broadcast.emit('leaderboard:update', leaderboard);
    socket.emit('leaderboard:update', leaderboard);

    console.log('🏆 Leaderboard updated and broadcasted');
  } catch (error) {
    console.error('❌ Error handling player update:', error);
  }
};

// NOTE: Handle player reconnection with enhanced data
const handlePlayerReconnect = async (socket, data) => {
  console.log(`🔄 Player Reconnect from ${socket.id}:`, data);
  const myUserId = data.userId;

  try {
    const connectedPlayers = Object.entries(players)
      .filter(([sid, info]) => info.userId !== myUserId)
      .map(([sid, info]) => ({
        id: sid,
        x: info.x,
        y: info.y,
        userId: info.userId,
        name: info.name,
        maxHeight: info.maxHeight,
        totalJumps: info.totalJumps,
        coinsCollected: info.coinsCollected,
        gemsCollected: info.gemsCollected,
        playTime: info.playTime,
        challengesCompleted: info.challengesCompleted,
      }));

    let dbPlayers = await getAllPlayersExcept(myUserId);

    const connectedUserIds = new Set(
      Object.values(players).map((p) => p.userId)
    );
    dbPlayers = dbPlayers.filter((p) => !connectedUserIds.has(p.userId));

    const offlinePlayers = dbPlayers.map((p) => ({
      id: `offline:${p.userId}`,
      x: p.x,
      y: p.y,
      userId: p.userId,
      name: p.name,
      maxHeight: p.maxHeight,
      totalJumps: p.totalJumps,
      coinsCollected: p.coinsCollected,
      gemsCollected: p.gemsCollected,
      playTime: p.playTime,
      challengesCompleted: p.challengesCompleted,
    }));

    // NOTE: Send all players data
    socket.emit('all-players', [...connectedPlayers, ...offlinePlayers]);

    // NOTE: Send current leaderboard
    console.log('🏆 Sending leaderboard on reconnect...');
    const leaderboard = await getLeaderboard(10);
    console.log('🏆 Leaderboard data for reconnect:', leaderboard);
    socket.emit('leaderboard:init', leaderboard);

    // NOTE: Send player achievements
    const achievements = await getPlayerAchievements(myUserId);
    socket.emit('achievements:update', achievements);

    // NOTE: Send collected items for this player
    const collectedItems = await getCollectedItems(myUserId);
    socket.emit('collectedItems:init', collectedItems);
  } catch (error) {
    console.error('❌ Error handling player reconnect:', error);
  }
};

// NOTE: Handle collectible collection
const handleCollectible = async (socket, data) => {
  console.log(`💰 Collectible collected by ${socket.id}:`, data);

  try {
    const { userId, itemId, type, value } = data;

    // NOTE: Mark item as collected for this user
    await markItemAsCollected(userId, itemId);

    // NOTE: Update player stats based on collectible type
    const updateData = {};
    if (type === 'coin') {
      updateData.coinsCollected =
        (players[socket.id]?.coinsCollected || 0) + value;
    } else if (type === 'gem') {
      updateData.gemsCollected =
        (players[socket.id]?.gemsCollected || 0) + value;
    }

    if (Object.keys(updateData).length > 0) {
      await savePlayerProgress({ userId, ...updateData });

      // NOTE: Update local player data
      if (players[socket.id]) {
        players[socket.id] = { ...players[socket.id], ...updateData };
      }
    }

    // NOTE: Confirm collection to client
    socket.emit('collectible:confirmed', { itemId, success: true });
  } catch (error) {
    console.error('❌ Error handling collectible:', error);
    socket.emit('collectible:confirmed', {
      itemId: data.itemId,
      success: false,
    });
  }
};

// NOTE: Handle player disconnect
const handlePlayerDisconnect = (socket) => {
  console.log(`❌ User Disconnected: ${socket.id}`);

  delete players[socket.id];

  socket.broadcast.emit('player:remove', socket.id);
};

// NOTE: Handle last position request
const handlePlayerRequestLastPosition = async (socket, data) => {
  console.log(`📥 Player Requested Last Position: ${socket.id}`, data);

  try {
    const playerProgress = await getPlayerProgress(data.userId);

    if (playerProgress) {
      socket.emit('player:lastPosition', {
        id: socket.id,
        x: playerProgress.x,
        y: playerProgress.y,
        userId: data.userId,
        maxHeight: playerProgress.maxHeight,
        totalJumps: playerProgress.totalJumps,
        coinsCollected: playerProgress.coinsCollected,
        gemsCollected: playerProgress.gemsCollected,
        playTime: playerProgress.playTime,
        challengesCompleted: playerProgress.challengesCompleted,
      });
    } else {
      console.log(`⚠️ No saved progress found for userId ${data.userId}`);
      socket.emit('player:lastPosition', null);
    }
  } catch (error) {
    console.error('❌ Error fetching player progress:', error);
    socket.emit('player:lastPosition', null);
  }
};

// NOTE: Handle leaderboard request
const handleLeaderboardRequest = async (socket) => {
  try {
    const leaderboard = await getLeaderboard(10);
    socket.emit('leaderboard:update', leaderboard);
  } catch (error) {
    console.error('❌ Error fetching leaderboard:', error);
  }
};

// NOTE: Handle stats update request
const handleStatsUpdate = async (socket, data) => {
  try {
    const { userId, stats } = data;
    await updatePlayerStats(userId, stats);

    // NOTE: Update local players data
    if (players[socket.id]) {
      players[socket.id] = { ...players[socket.id], ...stats };
    }

    // NOTE: Broadcast updated leaderboard
    const leaderboard = await getLeaderboard(10);
    socket.broadcast.emit('leaderboard:update', leaderboard);

    socket.emit('stats:updated', { success: true });
  } catch (error) {
    console.error('❌ Error updating stats:', error);
    socket.emit('stats:updated', { success: false, error: error.message });
  }
};

// NOTE: Handle achievement request
const handleAchievementRequest = async (socket, data) => {
  console.log(`🏆 Achievement Request from ${socket.id}:`, data);

  try {
    const { userId } = data;

    // NOTE: Get achievements from database
    const achievements = await getPlayerAchievements(userId);

    // NOTE: Send achievements back to player
    socket.emit('achievements:update', achievements);

    console.log(
      `✅ Sent ${achievements.length} achievements to user ${userId}`
    );
  } catch (error) {
    console.error('❌ Error handling achievement request:', error);
  }
};

// NOTE: Handle achievement unlock
const handleAchievementUnlock = async (socket, data) => {
  console.log(`🏆 Achievement Unlock from ${socket.id}:`, data);

  try {
    const { userId, achievementName } = data;

    // NOTE: Unlock achievement in database
    await unlockAchievement(userId, achievementName);

    // NOTE: Get updated achievements list
    const achievements = await getPlayerAchievements(userId);

    // NOTE: Send updated achievements back to player
    socket.emit('achievements:update', achievements);

    console.log(
      `✅ Achievement "${achievementName}" unlocked for user ${userId}`
    );
  } catch (error) {
    console.error('❌ Error handling achievement unlock:', error);
  }
};

// NOTE: Handle player reset (collision respawn)
const handlePlayerReset = async (socket, data) => {
  console.log(`🔄 Player Reset from ${socket.id}:`, data);

  try {
    const { userId, name } = data;

    // NOTE: Reset player progress in database
    await resetPlayerProgress(userId, name);

    // NOTE: Update local player data but preserve jumps and time
    if (players[socket.id]) {
      const currentJumps = players[socket.id].totalJumps || 0;
      const currentPlayTime = players[socket.id].playTime || 0;

      players[socket.id] = {
        ...players[socket.id],
        x: 1000,
        y: 7900,
        maxHeight: 0,
        totalJumps: currentJumps, // NOTE: Preserve jumps
        coinsCollected: 0,
        gemsCollected: 0,
        challengesCompleted: 0,
        playTime: currentPlayTime, // NOTE: Preserve play time
      };
    }

    // NOTE: Broadcast updated leaderboard
    const leaderboard = await getLeaderboard(10);
    socket.broadcast.emit('leaderboard:update', leaderboard);
    socket.emit('leaderboard:update', leaderboard);

    console.log(`✅ Player ${userId} progress reset successfully`);
  } catch (error) {
    console.error('❌ Error handling player reset:', error);
  }
};

// NOTE: Debug handler to check database state
const handleDebugRequest = async (socket) => {
  console.log(`🔍 Debug request from ${socket.id}`);

  try {
    const allPlayers = await Player.find().select(
      'name maxHeight totalJumps playTime achievements lastActive'
    );
    console.log('🔍 All players in database:', allPlayers);

    const leaderboard = await getLeaderboard(10);
    console.log('🔍 Current leaderboard:', leaderboard);

    socket.emit('debug:response', { allPlayers, leaderboard });
  } catch (error) {
    console.error('❌ Error in debug request:', error);
  }
};

module.exports = {
  handlePlayerUpdate,
  handlePlayerReconnect,
  handlePlayerDisconnect,
  handlePlayerRequestLastPosition,
  handleLeaderboardRequest,
  handleStatsUpdate,
  handleCollectible,
  handleAchievementUnlock,
  handleAchievementRequest,
  handlePlayerReset,
  handleDebugRequest,
};
