const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const socketHandler = require('./sockets/socketHandler');
const {
  getLeaderboardAPI,
  getTopPlayersAPI,
  getPlayerAchievementsAPI,
  getGameStatsAPI,
} = require('./controllers/gameController');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Jump Game Backend running 🏗️');
});

app.get('/api/leaderboard', getLeaderboardAPI);
app.get('/api/top-players', getTopPlayersAPI);
app.get('/api/player/:userId/achievements', getPlayerAchievementsAPI);
app.get('/api/game-stats', getGameStatsAPI);

io.on('connection', (socket) => {
  socketHandler(socket, io);
});

const PORT = process.env.PORT || 45271;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
