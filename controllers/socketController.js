const {
  getPlayerProgress,
  savePlayerProgress,
} = require("../services/playerService");

let players = {}; // Track players in the game

const handlePlayerUpdate = (socket, data) => {
  console.log(`📩 Player Update from ${socket.id}:`, data);
  savePlayerProgress(data);
  // Update the player position in memory
  players[socket.id] = {
    x: data.x,
    y: data.y,
    userId: data.userId,
  };

  // Broadcast the updated player data to all players
  socket.broadcast.emit("player:sync", {
    id: socket.id,
    ...players[socket.id],
  });
};

const handlePlayerReconnect = async (socket, data) => {
  console.log(`🔄 Player Reconnect from ${socket.id}:`, data);

  // Send all players' data to the reconnecting player
  socket.emit("all-players", players);
};

const handlePlayerDisconnect = (socket) => {
  console.log(`❌ User Disconnected: ${socket.id}`);

  // Remove the player from the in-memory players list
  delete players[socket.id];

  // Notify all other players to remove this player from their view
  socket.broadcast.emit("player:remove", socket.id);
};

const handlePlayerRequestLastPosition = async (socket, data) => {
  console.log(`📥 Player Requested Last Position: ${socket.id}`, data);

  try {
    const playerProgress = await getPlayerProgress(data.userId);

    if (playerProgress) {
      socket.emit("player:lastPosition", {
        id: socket.id,
        x: playerProgress.x,
        y: playerProgress.y,
        userId: data.userId,
      });
    } else {
      console.log(`⚠️ No saved progress found for userId ${data.userId}`);
      socket.emit("player:lastPosition", null);
    }
  } catch (error) {
    console.error("❌ Error fetching player progress:", error);
    socket.emit("player:lastPosition", null);
  }
};

module.exports = {
  handlePlayerUpdate,
  handlePlayerReconnect,
  handlePlayerDisconnect,
  handlePlayerRequestLastPosition,
};
