# DemoRun - Real-time Multiplayer 2D Platformer

A real-time multiplayer 2D platformer game built with React, Phaser.js, Node.js, Socket.io, and MongoDB. Features real-time player synchronization, challenges, achievements, collectibles, and a dynamic leaderboard.

## 🎮 Features

### Core Gameplay

- **Real-time Multiplayer**: Play with other players in real-time
- **2D Platformer**: Jump, climb, and explore challenging levels
- **Physics-based Movement**: Smooth jumping and collision detection
- **Persistent Progress**: Your position and stats are saved between sessions

### Enhanced Features

- **Challenges & Achievements**: Unlock achievements by reaching heights, collecting items, and completing challenges
- **Collectibles System**:
  - Coins and gems scattered throughout levels
  - **Per-user tracking**: Each player has their own collectibles - once collected, they never respawn for that player
  - Physics applied to prevent falling through platforms
- **Real-time Leaderboard**: See top 5 players with live updates
- **Interactive GUI**:
  - Player stats and height tracking
  - Achievements panel with close button
  - Leaderboard panel
  - Game statistics
- **Hazards & Checkpoints**: Spikes, lava, and respawn checkpoints
- **Enhanced Level Design**: Multiple platform types and challenging sections

### Technical Features

- **Real-time Synchronization**: Player positions and actions sync instantly
- **MongoDB Integration**: Persistent player data and statistics
- **Socket.io**: Real-time communication between players
- **Responsive Design**: Works on different screen sizes
- **Achievement System**: Prevents flickering with proper state management

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd demorun
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd frontend
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/demorun
   PORT=3001
   ```

   Create a `.env` file in the frontend directory:

   ```env
   REACT_APP_BACKEND_URL=http://localhost:3001
   ```

4. **Start MongoDB** (if using local installation)

   ```bash
   mongod
   ```

5. **Run the setup script**

   ```bash
   npm run setup
   ```

6. **Start the development servers**

   In the root directory:

   ```bash
   npm run dev
   ```

   In the frontend directory:

   ```bash
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 How to Play

### Controls

- **Arrow Keys / WASD**: Move left/right
- **Space / Up Arrow**: Jump
- **L Key**: Toggle Leaderboard
- **A Key**: Toggle Achievements Panel

### Objectives

- **Climb Higher**: Reach new heights to unlock achievements
- **Collect Items**: Gather coins and gems for points
- **Complete Challenges**: Unlock achievements by meeting requirements
- **Compete**: Try to reach the top of the leaderboard

### Achievements

- **Mountain Climber**: Reach 1000m height
- **Sky Walker**: Reach 2000m height
- **Cloud Surfer**: Reach 3000m height
- **Space Explorer**: Reach 4000m height
- **Cosmic Climber**: Reach 5000m height
- **Coin Collector**: Collect 50 coins
- **Treasure Hunter**: Collect 100 coins
- **Gem Master**: Collect 10 gems
- **Jump Master**: Make 100 jumps
- **Jump Legend**: Make 500 jumps

## 🛠️ Technical Architecture

### Backend (Node.js + Express)

- **server.js**: Main server file with Socket.io setup
- **controllers/**: Socket event handlers and game logic
- **services/**: Database operations and business logic
- **models/**: MongoDB schemas
- **sockets/**: Socket.io event routing

### Frontend (React + Phaser.js)

- **EnhancedJumpGame.jsx**: Main game component with Phaser integration
- **components/GameGUI.jsx**: User interface components
- **levels/enhancedLevels.js**: Level generation and challenge definitions
- **services/socketManager.js**: Socket.io client management

### Key Features

- **Real-time Multiplayer**: Players see each other moving in real-time
- **Persistent Data**: Player progress saved to MongoDB
- **Achievement System**: Prevents flickering with proper state management
- **Per-user Collectibles**: Each player has their own collectible state
- **World Bounds**: Proper collision detection with screen boundaries
- **Physics System**: Collectibles have physics to prevent falling through platforms

## 🔧 Recent Fixes

### Achievement System

- **Fixed Flickering**: Achievements now only show once and don't flicker
- **State Management**: Proper tracking of unlocked achievements
- **GUI Integration**: Added achievements panel with close button

### World Bounds & Physics

- **Right Border Fixed**: Removed world wrapping to maintain proper boundaries
- **Platform Bounds**: All platforms now stay within screen bounds
- **Collectible Physics**: Applied physics to prevent falling through platforms
- **Height Calculation**: Fixed to start at 0 and increase as you climb

### Collectible System

- **Per-user Tracking**: Each player has their own collectible state
- **No Respawn**: Once collected, items never respawn for that player
- **Backend Sync**: Collectible state saved to database
- **Physics Applied**: Collectibles don't fall through platforms

## 📊 API Endpoints

### Player Management

- `GET /api/players/leaderboard` - Get top players
- `GET /api/players/:userId/stats` - Get player statistics
- `POST /api/players/:userId/stats` - Update player statistics

### Socket Events

- `player:update` - Update player position and stats
- `player:reconnect` - Handle player reconnection
- `player:sync` - Sync player position with others
- `collectible:collected` - Handle collectible collection
- `leaderboard:update` - Update leaderboard
- `achievements:update` - Update achievements

## 🎨 Customization

### Adding New Achievements

Edit `frontend/src/levels/enhancedLevels.js`:

```javascript
export const challenges = [
  {
    id: 'new_achievement',
    name: 'New Achievement',
    description: 'Description here',
    requirement: 100,
    type: 'height', // or 'coins', 'gems', 'jumps'
    reward: 50,
  },
];
```

### Modifying Levels

Edit the `generateEnhancedLevels` function in `frontend/src/levels/enhancedLevels.js` to add new platforms, collectibles, or hazards.

## 🐛 Known Issues & Solutions

### Achievement Flickering

- **Issue**: Achievements were flickering on every key press
- **Solution**: Added proper state management with `unlockedAchievements` Set to track already unlocked achievements

### Missing Right Border

- **Issue**: Players could go through the right border
- **Solution**: Removed world wrapping and ensured all platforms stay within bounds

### Collectibles Falling Through Platforms

- **Issue**: Collectibles were falling through platforms
- **Solution**: Applied physics to collectibles and added collision detection

### Height Calculation

- **Issue**: Height was decreasing when going up
- **Solution**: Fixed calculation to start at 0 and increase as you climb

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎮 Enjoy Playing!

Jump into the world of DemoRun and compete with other players in this exciting real-time multiplayer platformer!
