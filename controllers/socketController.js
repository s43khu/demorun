const {
  getPlayerProgress,
  savePlayerProgress,
  getAllPlayersExcept,
} = require('../services/playerService');

let players = {};

const handlePlayerUpdate = (socket, data) => {
  console.log(`📩 Player Update from ${socket.id}:`, data);
  savePlayerProgress(data);
  players[socket.id] = {
    x: data.x,
    y: data.y,
    userId: data.userId,
    name: data.name,
  };

  socket.broadcast.emit('player:sync', {
    id: socket.id,
    ...players[socket.id],
  });
};

const handlePlayerReconnect = async (socket, data) => {
  console.log(`🔄 Player Reconnect from ${socket.id}:`, data);
  const myUserId = data.userId;

  const connectedPlayers = Object.entries(players)
    .filter(([sid, info]) => info.userId !== myUserId)
    .map(([sid, info]) => ({
      id: sid,
      x: info.x,
      y: info.y,
      userId: info.userId,
      name: info.name,
    }));

  let dbPlayers = await getAllPlayersExcept(myUserId);

  const connectedUserIds = new Set(Object.values(players).map((p) => p.userId));
  dbPlayers = dbPlayers.filter((p) => !connectedUserIds.has(p.userId));

  const offlinePlayers = dbPlayers.map((p) => ({
    id: `offline:${p.userId}`,
    x: p.x,
    y: p.y,
    userId: p.userId,
    name: p.name,
  }));

  socket.emit('all-players', [...connectedPlayers, ...offlinePlayers]);
};
const handlePlayerDisconnect = (socket) => {
  console.log(`❌ User Disconnected: ${socket.id}`);

  delete players[socket.id];

  socket.broadcast.emit('player:remove', socket.id);
};

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

module.exports = {
  handlePlayerUpdate,
  handlePlayerReconnect,
  handlePlayerDisconnect,
  handlePlayerRequestLastPosition,
};
