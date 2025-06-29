import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FuzzyText from '../animations/FuzzyText';

const GameGUI = ({ 
  playerName, 
  playerHeight, 
  leaderboard, 
  showLeaderboard, 
  toggleLeaderboard,
  showAchievements,
  toggleAchievements,
  achievements,
  achievementsLoading,
  gameStats,
  isPaused 
}) => {
  const [showStats, setShowStats] = useState(false);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  
  // NOTE: Calculate player rank
  const playerRank = leaderboard.findIndex(player => player.name === playerName) + 1;
  
  // NOTE: Get top 4 players plus current player
  const topPlayers = leaderboard.slice(0, 4);
  const currentPlayer = leaderboard.find(player => player.name === playerName);
  
  // NOTE: Create display list: top 4 + current player (if not in top 4)
  const displayPlayers = [...topPlayers];
  if (currentPlayer && !topPlayers.find(p => p.name === playerName)) {
    displayPlayers.push(currentPlayer);
  }

  // NOTE: Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 215, 0, 0.5);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 215, 0, 0.7);
    }
  `;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style>{scrollbarStyles}</style>
      
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Player Info */}
        <motion.div 
          className="bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="font-bold text-lg">{playerName}</div>
              <div className="text-sm text-gray-300">
                Height: {Math.abs(Math.round(playerHeight))}m
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex space-x-2 pointer-events-auto">
          {/* Leaderboard Toggle */}
          <motion.button
            onClick={toggleLeaderboard}
            className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-500/80 text-white px-4 py-2 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3}>
              🏆 Leaderboard
            </FuzzyText>
          </motion.button>

          {/* Achievements Toggle */}
          <motion.button
            onClick={toggleAchievements}
            className="bg-yellow-600/80 backdrop-blur-sm hover:bg-yellow-500/80 text-white px-4 py-2 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3}>
              🎖️ Achievements ({achievements.length})
            </FuzzyText>
          </motion.button>

          {/* Stats Toggle */}
          <motion.button
            onClick={() => setShowStats(!showStats)}
            className="bg-purple-600/80 backdrop-blur-sm hover:bg-purple-500/80 text-white px-4 py-2 rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FuzzyText baseIntensity={0.1} hoverIntensity={0.3}>
              📊 Stats
            </FuzzyText>
          </motion.button>
        </div>
      </div>

      {/* Player Rank Badge */}
      <motion.div 
        className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-lg shadow-lg">
          #{playerRank || 'N/A'}
        </div>
      </motion.div>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            className="absolute top-20 right-4 w-80 bg-black/80 backdrop-blur-sm rounded-2xl p-6 text-white pointer-events-auto"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                <FuzzyText baseIntensity={0.2} hoverIntensity={0.4}>
                  🏆 Top Players
                </FuzzyText>
              </h3>
              <button 
                onClick={toggleLeaderboard}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* NOTE: Show top 4 players plus current player */}
              {displayPlayers.map((player, index) => {
                // NOTE: Calculate actual rank from full leaderboard
                const actualRank = leaderboard.findIndex(p => p.name === player.name) + 1;
                const isCurrentPlayer = player.name === playerName;
                
                return (
                  <motion.div
                    key={player.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-all duration-200 ${
                      isCurrentPlayer 
                        ? 'bg-blue-600/50 border border-blue-400' 
                        : 'bg-gray-800/50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        actualRank === 1 ? 'bg-yellow-500 text-black' :
                        actualRank === 2 ? 'bg-gray-400 text-black' :
                        actualRank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {actualRank}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-300">
                          {Math.abs(Math.round(player.height || 0))}m
                        </div>
                      </div>
                    </div>
                    {isCurrentPlayer && (
                      <div className="text-blue-400 text-sm">YOU</div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* NOTE: Show expand/collapse button */}
              <motion.button
                onClick={() => setShowFullLeaderboard(!showFullLeaderboard)}
                className="w-full p-2 text-center text-gray-400 hover:text-white bg-gray-800/50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showFullLeaderboard ? '▼ Show Less' : '▼ Show All Players'}
              </motion.button>
              
              {/* NOTE: Show full leaderboard when expanded */}
              {showFullLeaderboard && (
                <motion.div
                  className="space-y-2 mt-4 pt-4 border-t border-gray-700"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {leaderboard.slice(4).map((player, index) => {
                    const actualRank = index + 5;
                    const isCurrentPlayer = player.name === playerName;
                    
                    return (
                      <motion.div
                        key={player.name}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isCurrentPlayer 
                            ? 'bg-blue-600/30 border border-blue-400/50' 
                            : 'bg-gray-700/30'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-gray-600 text-white">
                            {actualRank}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{player.name}</div>
                            <div className="text-xs text-gray-400">
                              {Math.abs(Math.round(player.height || 0))}m
                            </div>
                          </div>
                        </div>
                        {isCurrentPlayer && (
                          <div className="text-blue-400 text-xs">YOU</div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Panel - Overlay Popup */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              // NOTE: Close when clicking outside the panel
              if (e.target === e.currentTarget) {
                toggleAchievements();
              }
            }}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-yellow-500/30 rounded-3xl p-8 w-[500px] max-h-[80vh] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-yellow-400">
                  {!achievementsLoading && achievements.length > 0 ? (
                    <FuzzyText baseIntensity={0.2} hoverIntensity={0.4} visible={true}>
                      🏆 Achievements
                    </FuzzyText>
                  ) : (
                    '🏆 Achievements'
                  )}
                </h3>
                <button 
                  onClick={toggleAchievements}
                  className="bg-red-50 hover:text-white text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-all duration-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {achievementsLoading ? (
                  <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4 animate-spin">🔄</div>
                    <div className="text-xl font-semibold mb-2">Loading achievements...</div>
                    <div className="text-sm text-gray-500">Fetching from database</div>
                  </div>
                ) : achievements.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <div className="text-xl font-semibold mb-2">No achievements unlocked yet!</div>
                    <div className="text-sm text-gray-500">Keep playing to unlock achievements</div>
                    <div className="mt-4 text-xs text-gray-600">
                      <div>• Reach heights to unlock climbing achievements</div>
                      <div>• Collect coins and gems for treasure achievements</div>
                      <div>• Jump frequently for jumping achievements</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* NOTE: Show current stats */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                      <div className="text-center mb-3">
                        <div className="text-lg font-bold text-blue-300">Current Stats</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400">💰</span>
                          <span className="text-gray-300">Coins:</span>
                          <span className="text-yellow-300 font-bold">{gameStats.coinsCollected || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400">💎</span>
                          <span className="text-gray-300">Gems:</span>
                          <span className="text-blue-300 font-bold">{gameStats.gemsCollected || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400">⬆️</span>
                          <span className="text-gray-300">Jumps:</span>
                          <span className="text-green-300 font-bold">{gameStats.jumps || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-400">⏱️</span>
                          <span className="text-gray-300">Time:</span>
                          <span className="text-purple-300 font-bold">{Math.floor(gameStats.playTime / 60)}:{(gameStats.playTime % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* NOTE: Show achievements */}
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement}
                        className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-6 rounded-xl border border-yellow-400/30 backdrop-blur-sm hover:from-yellow-600/30 hover:to-orange-600/30 transition-all duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">🏆</div>
                          <div className="flex-1">
                            <div className="font-bold text-yellow-300 text-lg">{achievement}</div>
                            <div className="text-sm text-gray-300 mt-1">
                              Achievement unlocked!
                            </div>
                          </div>
                          <div className="text-yellow-400 text-2xl">✓</div>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-center text-gray-400 text-sm">
                  Press ESC or click ✕ to close • {achievements.length} achievements unlocked
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            className="absolute top-20 left-4 w-80 bg-black/80 backdrop-blur-sm rounded-2xl p-6 text-white pointer-events-auto"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                <FuzzyText baseIntensity={0.2} hoverIntensity={0.4}>
                  📊 Game Stats
                </FuzzyText>
              </h3>
              <button 
                onClick={() => setShowStats(false)}
                className="text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Current Height</div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.abs(Math.round(playerHeight))}m
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Jumps Made</div>
                <div className="text-2xl font-bold text-blue-400">
                  {gameStats.jumps || 0}
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Time Played</div>
                <div className="text-2xl font-bold text-purple-400">
                  {Math.floor(gameStats.playTime / 60)}:{(gameStats.playTime % 60).toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Challenges Completed</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {gameStats.challengesCompleted || 0}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Help */}
      <motion.div 
        className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-2xl p-4 text-white pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-sm">
          <div className="font-bold mb-2">Controls:</div>
          <div className="space-y-1 text-gray-300">
            <div>🔄 Arrow Keys - Move</div>
            <div>⬆️ Up Arrow - Jump</div>
            {/* <div>🏆 L - Leaderboard</div>
            <div>🎖️ A - Achievements</div>
            <div>🔍 D - Debug Info</div>
            <div>❌ ESC - Close Dialogs</div> */}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-4 right-4 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a 
          href="https://github.com/s43khu" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-2 text-white text-sm hover:bg-black/80 transition-all duration-200 flex items-center space-x-2 group"
        >
          <span className="text-gray-300">Made with</span>
          <span className="text-red-500 animate-pulse">❤️</span>
          <span className="text-gray-300">by</span>
          <span className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-200">shekhu</span>
        </a>
      </motion.div>
    </div>
  );
};

export default GameGUI; 