import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import bricks from './assets/bricks.png';
import dirt from './assets/Ground/Dirt/dirt.png';
import dirt_left from './assets/Ground/Dirt/dirtCliff_left.png';
import dirt_right from './assets/Ground/Dirt/dirtCliff_right.png';
import alienBiege_walk1 from './assets/Players/Variable sizes/Beige/alienBiege_walk1.png';
import alienBiege_walk2 from './assets/Players/Variable sizes/Beige/alienBiege_walk2.png';
import alienBiege_jump from './assets/Players/Variable sizes/Beige/alienBiege_jump.png';
import alienBiege_stand from './assets/Players/Variable sizes/Beige/alienBiege_stand.png';
import coinGold from './assets/Items/coinGold.png';
import gemBlue from './assets/Items/gemBlue.png';
import spikes from './assets/Tiles/spikes.png';
import { generateEnhancedLevels, challenges } from './levels/enhancedLevels';
import GameGUI from './components/GameGUI';
import FuzzyText from './animations/FuzzyText';
import toast from 'react-hot-toast';

const EnhancedJumpGame = ({ playerName }) => {
  const gameRef = useRef(null);
  const socketRef = useRef(null);
  const playerRef = useRef(null);
  const otherPlayersRef = useRef({});
  const previousPosition = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [gameStats, setGameStats] = useState({
    jumps: 0,
    playTime: 0,
    coinsCollected: 0,
    gemsCollected: 0,
    challengesCompleted: 0,
    maxHeight: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [currentHeight, setCurrentHeight] = useState(0);
  const [collectedItems, setCollectedItems] = useState(new Set());
  const [collectedItemsLoaded, setCollectedItemsLoaded] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [lastJumpTime, setLastJumpTime] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [groundLevel, setGroundLevel] = useState(7900);
  const achievementCheckTimeoutRef = useRef(null);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  const getPlayerId = () => {
    let playerId = localStorage.getItem('playerId-demoAArun');
    if (!playerId) {
      playerId = Math.random().toString(36).substr(2, 9);
      localStorage.setItem('playerId-demoAArun', playerId);
    }
    return playerId;
  };

  const playerId = useRef(getPlayerId());

  const getPlayerPosition = (userId) => {
    return new Promise((resolve, reject) => {
      socketRef.current.emit('player:requestLastPosition', { userId });
      socketRef.current.once('player:lastPosition', (data) => {
        if (data && data.x !== undefined && data.y !== undefined) {
          console.log('📥 Loading player stats from database:', data);
          
          // NOTE: Load all stats from database
          setGameStats(prev => ({
            ...prev,
            maxHeight: data.maxHeight || 0,
            jumps: data.totalJumps || 0,
            coinsCollected: data.coinsCollected || 0,
            gemsCollected: data.gemsCollected || 0,
            playTime: data.playTime || 0,
            challengesCompleted: data.challengesCompleted || 0
          }));
          
          // NOTE: Set current height based on loaded max height
          if (data.maxHeight) {
            setCurrentHeight(data.maxHeight);
          }
          
          resolve(data);
        } else {
          resolve({ x: 1000, y: 7900 });
        }
      });
    });
  };

  const getRandomTint = () => {
    const randomColor = Math.floor(Math.random() * 0xffffff); 
    return randomColor;
  };

  // NOTE: Calculate gradient colors based on height
  const getHeightGradient = (height) => {
    const normalizedHeight = Math.min(height / 5000, 1); // NOTE: Normalize to 0-1 over 5000m
    
    // NOTE: Start with light blue sky, transition to dark space
    const colors = [
      // NOTE: Sky colors (light to dark)
      '#87CEEB', // Light sky blue
      '#4682B4', // Steel blue
      '#2E4A6B', // Dark blue
      '#1a2a3a', // Very dark blue
      '#0a0a0a', // Almost black
      '#000000'  // Pure black
    ];
    
    const colorIndex = Math.floor(normalizedHeight * (colors.length - 1));
    const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
    const blend = (normalizedHeight * (colors.length - 1)) % 1;
    
    const currentColor = colors[colorIndex];
    const nextColor = colors[nextColorIndex];
    
    return `${currentColor} 0%, ${nextColor} 100%`;
  };

  const checkChallenges = (stats) => {
    const newAchievements = [];
    
    challenges.forEach(challenge => {
      const isAlreadyUnlocked = unlockedAchievements.has(challenge.id);
      let shouldAward = false;
      
      switch (challenge.type) {
        case 'height':
          shouldAward = stats.maxHeight >= challenge.requirement;
          break;
        case 'coins':
          shouldAward = stats.coinsCollected >= challenge.requirement;
          break;
        case 'gems':
          shouldAward = stats.gemsCollected >= challenge.requirement;
          break;
        case 'jumps':
          shouldAward = stats.jumps >= challenge.requirement;
          break;
      }
      
      if (shouldAward && !isAlreadyUnlocked) {
        newAchievements.push(challenge.name);
        setUnlockedAchievements(prev => new Set([...prev, challenge.id]));
        
        // NOTE: Send achievement unlock to server immediately
        console.log('🏆 Unlocking achievement:', challenge.name);
        socketRef.current.emit('achievement:unlock', {
          userId: playerId.current,
          achievementName: challenge.name
        });
        
        // NOTE: Show toast immediately
        const challengeData = challenges.find(c => c.name === challenge.name);
        if (challengeData) {
          toast.success(`🏆 Achievement Unlocked: ${challenge.name}! +${challengeData.reward} points`);
        }
      }
    });
    
    if (newAchievements.length > 0) {
      setGameStats(prev => ({
        ...prev,
        challengesCompleted: prev.challengesCompleted + newAchievements.length
      }));
      
      // NOTE: Update local achievements state immediately
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // NOTE: Send updated achievements to server
      const updatedAchievements = [...achievements, ...newAchievements];
      socketRef.current.emit('player:update', {
        userId: playerId.current,
        name: playerName,
        x: playerRef.current?.x || 1000,
        y: playerRef.current?.y || 7900,
        maxHeight: gameStats.maxHeight,
        totalJumps: gameStats.jumps,
        coinsCollected: gameStats.coinsCollected,
        gemsCollected: gameStats.gemsCollected,
        playTime: gameStats.playTime,
        challengesCompleted: gameStats.challengesCompleted + newAchievements.length,
        achievements: updatedAchievements
      });
    }
  };

  // NOTE: Debounced achievement check to prevent spam
  const debouncedAchievementCheck = (stats) => {
    if (achievementCheckTimeoutRef.current) {
      clearTimeout(achievementCheckTimeoutRef.current);
    }
    
    achievementCheckTimeoutRef.current = setTimeout(() => {
      checkChallenges(stats);
    }, 100); // NOTE: Wait 100ms before checking achievements
  };

  const updateGameStats = (newStats) => {
    setGameStats(prev => {
      const updated = { ...prev, ...newStats };
      
      const hasRelevantChange = 
        updated.maxHeight !== prev.maxHeight ||
        updated.coinsCollected !== prev.coinsCollected ||
        updated.gemsCollected !== prev.gemsCollected ||
        updated.jumps !== prev.jumps;
      
      if (hasRelevantChange) {
        setTimeout(() => {
          debouncedAchievementCheck(updated);
        }, 0);
      }
      return updated;
    });
  };

  const handleCollectible = (itemId, type, value) => {
    if (collectedItems.has(itemId)) return;
    
    setCollectedItems(prev => new Set([...prev, itemId]));
    
    socketRef.current.emit('collectible:collected', {
      userId: playerId.current,
      itemId: itemId.toString(),
      type,
      value
    });
    
    if (type === 'coin') {
      const newCoins = gameStats.coinsCollected + value;
      setGameStats(prev => ({ ...prev, coinsCollected: newCoins }));
      toast.success(`💰 +${value} coins!`);
      setTimeout(() => {
        debouncedAchievementCheck({ ...gameStats, coinsCollected: newCoins });
      }, 0);
    } else if (type === 'gem') {
      const newGems = gameStats.gemsCollected + value;
      setGameStats(prev => ({ ...prev, gemsCollected: newGems }));
      toast.success(`💎 +${value} gems!`);
      setTimeout(() => {
        debouncedAchievementCheck({ ...gameStats, gemsCollected: newGems });
      }, 0);
    }
  };

  // NOTE: Handle hazard collision - check direction for spikes
  const handleHazardCollision = () => {
    if (playerRef.current) {
      // NOTE: Reset to start position (center of screen, ground level)
      const startX = 1000; // NOTE: Center of 2000px wide screen
      const startY = groundLevel - 100;
      playerRef.current.setPosition(startX, startY);
      
      // NOTE: Reset game stats but preserve jumps and play time
      setGameStats(prev => ({
        ...prev,
        maxHeight: 0,
        coinsCollected: 0,
        gemsCollected: 0,
        challengesCompleted: 0
        // NOTE: Keep jumps and play time incremental
      }));
      
      // NOTE: Reset unlocked achievements
      setUnlockedAchievements(new Set());
      
      // NOTE: Reset current height
      setCurrentHeight(0);
      
      // NOTE: Call server to reset player progress in database
      socketRef.current.emit('player:reset', {
        userId: playerId.current,
        name: playerName
      });
      
      toast.error('💀 You fell! Starting over from the beginning.');
    }
  };

  // NOTE: Fetch achievements from database when panel is opened
  const fetchAchievementsFromDB = async () => {
    try {
      console.log('🎖️ Requesting achievements for user:', playerId.current);
      setAchievementsLoading(true);
      socketRef.current.emit('player:requestAchievements', { userId: playerId.current });
      
      // NOTE: Add timeout to clear loading state if server doesn't respond
      setTimeout(() => {
        if (achievementsLoading) {
          console.log('🎖️ Timeout reached, clearing loading state');
          setAchievementsLoading(false);
        }
      }, 5000); // NOTE: Wait 5 seconds for server response
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      setAchievementsLoading(false);
    }
  };

  // NOTE: Handle achievements panel toggle
  const handleAchievementsToggle = () => {
    console.log('🎖️ Toggling achievements panel, current state:', showAchievements);
    console.log('🎖️ Current achievements:', achievements);
    if (!showAchievements) {
      // NOTE: Fetch fresh achievements from DB when opening
      fetchAchievementsFromDB();
    }
    setShowAchievements(!showAchievements);
  };

  // NOTE: Handle leaderboard panel toggle with refresh
  const handleLeaderboardToggle = () => {
    if (!showLeaderboard) {
      // NOTE: Request fresh leaderboard data when opening
      console.log('🏆 Requesting fresh leaderboard data...');
      socketRef.current.emit('leaderboard:request');
    }
    setShowLeaderboard(!showLeaderboard);
  };

  // NOTE: Debug function to check database state
  const handleDebugRequest = () => {
    console.log('🔍 Requesting debug info...');
    socketRef.current.emit('debug:request');
  };

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL);
    socketRef.current.emit('player:reconnect', {
      userId: playerId.current,
      name: playerName,
      achievements: achievements
    });

    const config = {
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800 },
          debug: false,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: 'phaser-game',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server', socketRef.current.id);
    });

    socketRef.current.on('player:sync', (data) => {
      if (data.id === socketRef.current.id) return;
    
      const currentScene = gameRef.current.scene.keys.default;
      const randomTint = getRandomTint();
    
      if (!otherPlayersRef.current[data.id]) {
        const avatar = currentScene.add.sprite(data.x, data.y, 'player').setScale(0.20);
        avatar.setTint(randomTint);  
    
        const nameTag = currentScene.add.text(data.x, data.y - 50, data.name || 'Unknown', {
          font: '16px Arial',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }).setOrigin(0.5);
    
        otherPlayersRef.current[data.id] = {
          sprite: avatar,
          nameTag,
          targetX: data.x,
          targetY: data.y,
        };
      } else {
        const player = otherPlayersRef.current[data.id];
        player.targetX = data.x;
        player.targetY = data.y;
      }
    
      setPlayers((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    });

    socketRef.current.on('all-players', (allPlayers) => {
      const currentScene = gameRef.current.scene.keys.default;
      const others = {};
    
      // NOTE: Clear existing offline players first
      Object.entries(otherPlayersRef.current).forEach(([id, player]) => {
        if (id.startsWith('offline:')) {
          if (player.sprite) player.sprite.destroy();
          if (player.nameTag) player.nameTag.destroy();
          delete otherPlayersRef.current[id];
        }
      });
    
      Object.entries(allPlayers).forEach(([id, data]) => {
        if (id !== socketRef.current.id) {
          // NOTE: Check if player already exists (online player)
          if (!otherPlayersRef.current[data.id]) {
            const randomTint = getRandomTint();  
    
            const avatar = currentScene.add.sprite(data.x, data.y, 'player').setScale(0.20);
            avatar.setTint(randomTint);  
    
            const nameTag = currentScene.add.text(data.x, data.y - 50, data.name || 'Unknown', {
              font: '16px Arial',
              fill: '#ffffff',
              stroke: '#000000',
              strokeThickness: 3,
            }).setOrigin(0.5);
    
            otherPlayersRef.current[data.id] = {
              sprite: avatar,
              nameTag,
              targetX: data.x,
              targetY: data.y,
            };
          } else {
            // NOTE: Update existing player position
            const player = otherPlayersRef.current[data.id];
            player.targetX = data.x;
            player.targetY = data.y;
          }
          others[id] = data;
        }
      });
    
      setPlayers((prev) => ({ ...prev, ...others }));
    });

    socketRef.current.on('player:remove', (playerId) => {
      setPlayers((prevPlayers) => {
        const { [playerId]: _, ...rest } = prevPlayers;
        return rest;
      });
    });

    socketRef.current.on('leaderboard:init', (data) => {
      console.log('🏆 Received leaderboard init:', data);
      setLeaderboard(data);
    });

    socketRef.current.on('leaderboard:update', (data) => {
      console.log('🏆 Received leaderboard update:', data);
      setLeaderboard(data);
    });

    socketRef.current.on('debug:response', (data) => {
      console.log('🔍 Debug response received:', data);
    });

    socketRef.current.on('achievements:update', (data) => {
      console.log('🎖️ Received achievements from server:', data);
      setAchievements(data);
      setAchievementsLoading(false);
      
      // NOTE: Update unlocked achievements set
      data.forEach(achievement => {
        const challenge = challenges.find(c => c.name === achievement);
        if (challenge) {
          setUnlockedAchievements(prev => new Set([...prev, challenge.id]));
        }
      });
    });

    socketRef.current.on('collectedItems:init', (data) => {
      setCollectedItems(new Set(data));
      setCollectedItemsLoaded(true);
    });

    socketRef.current.on('collectible:confirmed', (data) => {
      if (!data.success) {
        setCollectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.itemId);
          return newSet;
        });
      }
    });

    const handleKeyPress = (event) => {
      // NOTE: Prevent key handling when game is focused on input elements
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }
      // NOTE: Handle ESC key first to close dialogs and return
      if (event.key === 'Escape') {
        event.preventDefault();
        if (showAchievements) {
          setShowAchievements(false);
          return;
        }
        if (showLeaderboard) {
          setShowLeaderboard(false);
          return;
        }
      }
      // NOTE: Prevent default behavior for these keys to avoid conflicts
      if (['l', 'L', 'a', 'A', 'd', 'D'].includes(event.key)) {
        event.preventDefault();
      }
      if (event.key === 'l' || event.key === 'L') {
        handleLeaderboardToggle();
      } else if (event.key === 'a' || event.key === 'A') {
        handleAchievementsToggle();
      } else if (event.key === 'd' || event.key === 'D') {
        handleDebugRequest();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', handleResize);

    const timer = setInterval(() => {
      setGameStats(prev => ({
        ...prev,
        playTime: Math.floor((Date.now() - gameStartTime) / 1000)
      }));
    }, 1000);

    // NOTE: Periodic leaderboard refresh
    const leaderboardTimer = setInterval(() => {
      if (socketRef.current) {
        console.log('🏆 Periodic leaderboard refresh...');
        socketRef.current.emit('leaderboard:request');
      }
    }, 10000); // NOTE: Refresh every 10 seconds

    // NOTE: Periodic stats save to ensure data persistence
    const statsSaveTimer = setInterval(() => {
      if (socketRef.current && playerRef.current) {
        console.log('💾 Periodic stats save...');
        socketRef.current.emit('player:update', {
          userId: playerId.current,
          name: playerName,
          x: playerRef.current.x,
          y: playerRef.current.y,
          maxHeight: gameStats.maxHeight,
          totalJumps: gameStats.jumps,
          coinsCollected: gameStats.coinsCollected,
          gemsCollected: gameStats.gemsCollected,
          playTime: gameStats.playTime,
          challengesCompleted: gameStats.challengesCompleted,
          achievements: achievements
        });
      }
    }, 30000); // NOTE: Save every 30 seconds

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
      clearInterval(leaderboardTimer);
      clearInterval(statsSaveTimer);
    };
  }, []);

  // NOTE: Check achievements when stats change significantly
  useEffect(() => {
    const checkForNewAchievements = () => {
      const currentStats = {
        maxHeight: gameStats.maxHeight,
        coinsCollected: gameStats.coinsCollected,
        gemsCollected: gameStats.gemsCollected,
        jumps: gameStats.jumps
      };
      
      // NOTE: Only check if we have meaningful stats
      if (currentStats.maxHeight > 0 || currentStats.coinsCollected > 0 || 
          currentStats.gemsCollected > 0 || currentStats.jumps > 0) {
        debouncedAchievementCheck(currentStats);
      }
    };
    
    // NOTE: Use a longer delay to prevent spam
    const timeoutId = setTimeout(checkForNewAchievements, 500);
    
    return () => clearTimeout(timeoutId);
  }, [gameStats.maxHeight, gameStats.coinsCollected, gameStats.gemsCollected, gameStats.jumps]);

  // NOTE: Remove already collected items when data is loaded
  useEffect(() => {
    if (collectedItemsLoaded && gameRef.current && collectedItems.size > 0) {
      const currentScene = gameRef.current.scene.keys.default;
      if (currentScene && currentScene.collectiblesGroup) {
        // NOTE: Remove collectibles that are already collected
        currentScene.collectiblesGroup.children.entries.forEach(collectible => {
          if (collectible.itemData && collectedItems.has(collectible.itemData.id.toString())) {
            collectible.destroy();
          }
        });
      }
    }
  }, [collectedItemsLoaded, collectedItems]);

  const handleResize = () => {
    if (gameRef.current) {
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    }
  };

  const preload = function () {
    this.load.image('player_walk1', alienBiege_walk1);
    this.load.image('player_walk2', alienBiege_walk2);
    this.load.image('player_jump', alienBiege_jump);
    this.load.image('player_stand', alienBiege_stand);
    this.load.image('platform', 'assets/platform.png');
    this.load.image('groundTileM', dirt);
    this.load.image('groundTileR', dirt_right);
    this.load.image('groundTileL', dirt_left);
    this.load.image('coin', coinGold);
    this.load.image('gem', gemBlue);
    this.load.image('spike', spikes);
  };

  const create = async function () {
    const screenWidth = 2000;
    const screenHeight = 8000;
    const lastPosition = await getPlayerPosition(playerId.current);
    console.log('Last Position from DB:', lastPosition);
  
    const platforms = this.physics.add.staticGroup();
    const ground = platforms.create(
      screenWidth / 2, 
      screenHeight - 20, 
      'platform'
    );
    const groundScaleX = screenWidth / ground.width;
    ground.setScale(groundScaleX, 1).refreshBody();
  
    setGroundLevel(screenHeight - 20);
  
    const levelData = generateEnhancedLevels(screenWidth, screenHeight);
    
    levelData.platforms.forEach(({ x, y, tile, tilesCount = 3 }) => {
      const tileSpacing = 12;
      const totalWidth = tilesCount * tileSpacing;
      const leftEdge = x - (totalWidth / 2);
      const rightEdge = x + (totalWidth / 2);
      
      if (leftEdge < 0 || rightEdge > screenWidth) {
        return;
      }
      
      for (let i = 0; i < tilesCount; i++) {
        let tileKey = tile;
        if (i === 0) tileKey = 'groundTileL';
        else if (i === tilesCount - 1) tileKey = 'groundTileR';
        else tileKey = 'groundTileM';
  
        const tileSprite = platforms.create(x + i * tileSpacing, y, tileKey);
        tileSprite.setScale(0.4, 0.25).refreshBody();
      }
    });

    const collectiblesGroup = this.physics.add.group();
    this.collectiblesGroup = collectiblesGroup; // NOTE: Make it accessible from scene
    
    // NOTE: Create collectibles - if collectedItemsLoaded is not ready, create all collectibles
    // They will be filtered out when the collected items data is loaded
    levelData.collectibles.forEach((item, index) => {
      // NOTE: Only create if not already collected (when data is loaded) or create all if data not loaded yet
      if (!collectedItemsLoaded || !collectedItems.has(index.toString())) {
        const sprite = collectiblesGroup.create(item.x, item.y, item.type === 'coin' ? 'coin' : 'gem');
        sprite.setScale(0.3);
        sprite.itemData = { id: index, type: item.type, value: item.value };
        sprite.body.setGravityY(800);
        sprite.body.setBounce(0.2);
      }
    });

    const hazardsGroup = this.physics.add.staticGroup();
    levelData.hazards.forEach((hazard, index) => {
      const sprite = hazardsGroup.create(hazard.x, hazard.y, 'spike');
      sprite.setScale(0.5);
      sprite.hazardData = { id: index, type: hazard.type };
      // NOTE: Use full spike size for collision detection - deadly from all directions
      // sprite.body.setSize(sprite.width * 0.3, sprite.height * 0.2);
      // sprite.body.setOffset(sprite.width * 0.35, sprite.height * 0.1);
    });
  
    const maxHeightAboveGround = Math.abs(lastPosition.y) + screenHeight + 500;
  
    this.physics.world.setBounds(
      0,
      -maxHeightAboveGround,
      screenWidth,
      maxHeightAboveGround + screenHeight
    );
    this.cameras.main.setBounds(
      0,
      -maxHeightAboveGround,
      screenWidth,
      maxHeightAboveGround + screenHeight
    );
  
    playerRef.current = this.physics.add.sprite(screenWidth / 2, screenHeight - 100, 'player_stand').setScale(0.20);
    
    const spawnX = lastPosition.x || screenWidth / 2;
    const spawnY = lastPosition.y || screenHeight - 100;
    playerRef.current.setPosition(spawnX, spawnY);

    this.anims.create({
      key: 'walk',
      frames: [
        { key: 'player_walk1' },
        { key: 'player_walk2' }
      ],
      frameRate: 10,
      repeat: -1
    });
  
    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player_jump' }],
      frameRate: 10
    });
  
    this.anims.create({
      key: 'stand',
      frames: [{ key: 'player_stand' }],
      frameRate: 10
    });
  
    playerRef.current.anims.play('stand');
    playerRef.current.body.allowGravity = true; 
    playerRef.current.setBounce(0.2);
    playerRef.current.setCollideWorldBounds(true);
    playerRef.current.setDragX(600);
    playerRef.current.setMaxVelocity(300, 600);
    
    this.physics.add.collider(playerRef.current, platforms);
    // NOTE: Use overlap for hazards to check collision direction
    this.physics.add.overlap(playerRef.current, hazardsGroup, (player, hazard) => {
      if (hazard.hazardData && hazard.hazardData.type === 'spike') {
        // NOTE: Check if player is touching spike from below (should act as platform)
        const playerBottom = player.y + player.height / 2;
        const spikeTop = hazard.y - hazard.height / 2;
        const collisionThreshold = 10; // NOTE: Small threshold for collision detection
        
        // NOTE: If player's bottom is near spike's top and falling down, treat as platform collision
        if (Math.abs(playerBottom - spikeTop) <= collisionThreshold && player.body.velocity.y >= 0) {
          // NOTE: This is a platform collision from below - stop player's fall
          player.setVelocityY(0);
          player.y = spikeTop - player.height / 2;
          return;
        }
        
        // NOTE: Otherwise, it's a deadly collision from sides or top
        console.log('💀 Spike collision detected - deadly!');
      }
      
      // NOTE: Handle deadly collision (reset player)
      if (playerRef.current) {
        // NOTE: Reset to start position (center of screen, ground level)
        const startX = 1000; // NOTE: Center of 2000px wide screen
        const startY = groundLevel - 100;
        playerRef.current.setPosition(startX, startY);
        
        // NOTE: Reset game stats but preserve jumps and play time
        setGameStats(prev => ({
          ...prev,
          maxHeight: 0,
          coinsCollected: 0,
          gemsCollected: 0,
          challengesCompleted: 0
          // NOTE: Keep jumps and play time incremental
        }));
        
        // NOTE: Reset unlocked achievements
        setUnlockedAchievements(new Set());
        
        // NOTE: Reset current height
        setCurrentHeight(0);
        
        // NOTE: Call server to reset player progress in database
        socketRef.current.emit('player:reset', {
          userId: playerId.current,
          name: playerName
        });
        
        toast.error('💀 You fell! Starting over from the beginning.');
      }
    }, null, this);
    this.physics.add.overlap(playerRef.current, collectiblesGroup, (player, collectible) => {
      handleCollectible(collectible.itemData.id, collectible.itemData.type, collectible.itemData.value);
      collectible.destroy();
    }, null, this);
  
    this.physics.add.collider(collectiblesGroup, platforms);
  
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(playerRef.current, true, 0.05, 0.05);

    socketRef.current.emit('player:reconnect', {
      userId: playerId.current,
      name: playerName,
      achievements: achievements
    });
    setIsLoading(false);
  };
  
  const update = function () {
    if (!playerRef.current || !this.cursors) return;
  
    let velocityX = 0;
  
    if (this.cursors.left.isDown) {
      velocityX = -500;
      playerRef.current.anims.play('walk', true);
      playerRef.current.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      velocityX = 500;
      playerRef.current.anims.play('walk', true);
      playerRef.current.setFlipX(false);
    } else {
      playerRef.current.anims.play('stand');
    }
  
    playerRef.current.setVelocityX(velocityX);
  
    if (this.cursors.up.isDown && playerRef.current.body.touching.down) {
      const now = Date.now();
      if (now - lastJumpTime > 100) {
        playerRef.current.anims.play('jump');
        playerRef.current.setVelocityY(-550);
        setLastJumpTime(now);
        setGameStats(prev => ({
          ...prev,
          jumps: prev.jumps + 1
        }));
      }
    }
  
    if (!(this.cursors.up.isDown && playerRef.current.body.touching.down)) {
      playerRef.current.setVelocityY(playerRef.current.body.velocity.y);
    }

    const currentPlayerHeight = Math.max(0, groundLevel - playerRef.current.y);
    setCurrentHeight(currentPlayerHeight);
    
    if (currentPlayerHeight > gameStats.maxHeight) {
      const newMaxHeight = currentPlayerHeight;
      setGameStats(prev => ({
        ...prev,
        maxHeight: newMaxHeight
      }));
      
      // NOTE: Immediately send update when maxHeight increases
      socketRef.current.emit('player:update', {
        userId: playerId.current,
        name: playerName,
        x: playerRef.current.x,
        y: playerRef.current.y,
        maxHeight: newMaxHeight,
        totalJumps: gameStats.jumps,
        coinsCollected: gameStats.coinsCollected,
        gemsCollected: gameStats.gemsCollected,
        playTime: gameStats.playTime,
        challengesCompleted: gameStats.challengesCompleted,
        achievements: achievements
      });
    }
  
    if (
      playerRef.current.x !== previousPosition.current.x ||
      playerRef.current.y !== previousPosition.current.y
    ) {
      const currentMaxHeight = Math.max(gameStats.maxHeight, currentPlayerHeight);
      
      socketRef.current.emit('player:update', {
        userId: playerId.current,
        name: playerName,
        x: playerRef.current.x,
        y: playerRef.current.y,
        maxHeight: currentMaxHeight,
        totalJumps: gameStats.jumps,
        coinsCollected: gameStats.coinsCollected,
        gemsCollected: gameStats.gemsCollected,
        playTime: gameStats.playTime,
        challengesCompleted: gameStats.challengesCompleted,
        achievements: achievements
      });
      previousPosition.current = {
        x: playerRef.current.x,
        y: playerRef.current.y,
      };
    }
  
    Object.entries(otherPlayersRef.current).forEach(([id, player]) => {
      if (player.sprite && player.targetX !== undefined) {
        player.sprite.x = Phaser.Math.Linear(player.sprite.x, player.targetX, 0.1);
        player.sprite.y = Phaser.Math.Linear(player.sprite.y, player.targetY, 0.1);
        player.nameTag.x = player.sprite.x;
        player.nameTag.y = player.sprite.y - 50;
    
        const positionThreshold = 5; 
    
        const isAtTargetX = Math.abs(player.sprite.x - player.targetX) <= positionThreshold;
        const isAtTargetY = Math.abs(player.sprite.y - player.targetY) <= positionThreshold;
    
        if (!isAtTargetX || !isAtTargetY) {
          if (!isAtTargetX) {
            player.sprite.anims.play('walk', true);
          } else if (!isAtTargetY) {
            player.sprite.anims.play('jump', true);
          }
        } else {
          player.sprite.anims.play('stand', true);
        }
      }
    });
  };
  
  return (
    <div
      id="game-container"
      style={{
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(to bottom, 
          ${getHeightGradient(currentHeight)})`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '1280px',
          height: '720px',
          border: '8px solid #8B4513',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          background: '#2C3E50',
        }}
      >
        <div
          id="phaser-game"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        />
      </div>

      {isLoading && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '20px',
          borderRadius: '10px'
        }}>
          <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
            LOADING {'>>'}
          </FuzzyText>
        </div>
      )}

      <GameGUI
        playerName={playerName}
        playerHeight={currentHeight}
        leaderboard={leaderboard}
        showLeaderboard={showLeaderboard}
        toggleLeaderboard={handleLeaderboardToggle}
        showAchievements={showAchievements}
        toggleAchievements={handleAchievementsToggle}
        achievements={achievements}
        achievementsLoading={achievementsLoading}
        gameStats={gameStats}
        isPaused={false}
      />
    </div>
  );
};

export default EnhancedJumpGame; 