const {
  handlePlayerUpdate,
  handlePlayerReconnect,
  handlePlayerDisconnect,
  handlePlayerRequestLastPosition,
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

  socket.on('disconnect', () => {
    handlePlayerDisconnect(socket, io);
  });
};
