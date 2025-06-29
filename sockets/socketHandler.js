const {
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
} = require('../controllers/socketController');

module.exports = (socket, io) => {
  console.log(`✅ New User Connected: ${socket.id}`);

  socket.on('player:update', (data) => {
    handlePlayerUpdate(socket, data);
  });

  socket.on('player:reconnect', (data) => {
    handlePlayerReconnect(socket, data);
  });

  socket.on('player:requestLastPosition', (data) => {
    handlePlayerRequestLastPosition(socket, data);
  });

  socket.on('leaderboard:request', () => {
    handleLeaderboardRequest(socket);
  });

  socket.on('stats:update', (data) => {
    handleStatsUpdate(socket, data);
  });

  socket.on('collectible:collected', (data) => {
    handleCollectible(socket, data);
  });

  socket.on('achievement:unlock', (data) => {
    handleAchievementUnlock(socket, data);
  });

  socket.on('player:requestAchievements', (data) => {
    handleAchievementRequest(socket, data);
  });

  socket.on('player:reset', (data) => {
    handlePlayerReset(socket, data);
  });

  socket.on('debug:request', () => {
    handleDebugRequest(socket);
  });

  socket.on('disconnect', () => {
    handlePlayerDisconnect(socket, io);
  });
};
