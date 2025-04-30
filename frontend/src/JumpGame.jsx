import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import { loadLevel } from './levels/levelManager';

const JumpGame = () => {
  const gameRef = useRef(null); 
  const socketRef = useRef(null);
  const playerRef = useRef(null);
  const otherPlayersRef = useRef({});
  const [showOverlay, setShowOverlay] = useState(false); 
  const previousPosition = useRef({ x: 0, y: 0 }); 
  const [players, setPlayers] = useState({});

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
          resolve(data);
        } else {
          reject('Position data is not valid');
        }
      });
    });
  };


  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL);
    socketRef.current.emit('player:reconnect', { userId: playerId.current });

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
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
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server', socketRef.current.id);
    });

    socketRef.current.on('player:sync', (data) => {
      setPlayers((prevPlayers) => {
        if (!otherPlayersRef.current[data.id]) {
          const avatar = gameRef.current.scene.keys.default.add.sprite(data.x, data.y, 'player').setScale(0.5);
          avatar.setTint(0x00ff00);
          otherPlayersRef.current[data.id] = avatar;
        }
        return {
          ...prevPlayers,
          [data.id]: data,
        };
      });
    });
    socketRef.current.on('all-players', (allPlayers) => {
      setPlayers(allPlayers); 
    });

    socketRef.current.on('player:remove', (playerId) => {
      setPlayers((prevPlayers) => {
        const { [playerId]: _, ...rest } = prevPlayers;
        return rest;
      });
    });

    window.addEventListener('resize', handleResize);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  const handleResize = () => {
    if (gameRef.current) {
      gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
    }
  };

  const preload = function () {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('groundTile', 'https://labs.phaser.io/assets/tilemaps/tiles/tileset.png');
    this.load.image('dangerTile', 'https://labs.phaser.io/assets/tilemaps/tiles/tileset-danger.png');
    this.load.image('platformTile', 'https://labs.phaser.io/assets/tilemaps/tiles/tileset-platform.png');
    this.load.image('jumpTile', 'https://labs.phaser.io/assets/tilemaps/tiles/tileset-jump.png');
  
  };

  const create = async function() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const lastPosition = await getPlayerPosition(playerId.current);
    console.log('Last Position from DB:', lastPosition);


    const platforms = this.physics.add.staticGroup();
    

    const ground = platforms.create(screenWidth / 2, screenHeight - 20, 'platform');
    const groundScaleX = screenWidth / ground.width;
    ground.setScale(groundScaleX, 1).refreshBody();

    const levelData = loadLevel(screenWidth, screenHeight);
    levelData.forEach(({ x, y, tile , tilesCount = 3 }) => {
      let platform;
  
  for (let i = 0; i < tilesCount; i++) {
  const tileSpacing = 18;
  if (tile === 'groundTile') {
    platform = platforms.create(x + (i * tileSpacing), y, 'groundTile');
  } else if (tile === 'dangerTile') {
    platform = platforms.create(x + (i * tileSpacing), y, 'dangerTile');
  } else if (tile === 'jumpTile') {
    platform = platforms.create(x + (i * tileSpacing), y, 'jumpTile');
  } else if (tile === 'platformTile') {
    platform = platforms.create(x + (i * tileSpacing), y, 'platformTile');
  }

  platform.setScale(0.5).refreshBody();
}
    });

    const maxHeightAboveGround = Math.abs(lastPosition.y) + screenHeight + 500;

    this.physics.world.setBounds(0, -maxHeightAboveGround, screenWidth, maxHeightAboveGround + screenHeight);
    this.cameras.main.setBounds(0, -maxHeightAboveGround, screenWidth, maxHeightAboveGround + screenHeight);


    playerRef.current = this.physics.add.sprite(screenWidth / 2, screenHeight - 100, 'player').setScale(0.5);

    playerRef.current.body.allowGravity = false;

    playerRef.current.setBounce(0.2);
    playerRef.current.setCollideWorldBounds(true);
    playerRef.current.setDragX(600);
    playerRef.current.setMaxVelocity(300, 600);
    this.physics.add.collider(playerRef.current, platforms);
    playerRef.current.setPosition(lastPosition.x, lastPosition.y);
  
    playerRef.current.body.allowGravity = true;
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.wrap(playerRef.current, 5);

    this.cameras.main.startFollow(playerRef.current, true, 0.05, 0.05);
    // this.cameras.main.setBounds(0, -1500, screenWidth, screenHeight + 1500);
    // this.physics.world.setBounds(0, -1500, screenWidth, screenHeight + 1500);

    this.winText = this.add.text(screenWidth / 2, playerRef.current.y - 200, '', {
      fontSize: '48px',
      color: '#00ff00',
      fontFamily: 'Arial',
    }).setOrigin(0.5);

    socketRef.current.emit('player:reconnect', { userId: playerId.current });
  };

  const update = function () {
    if (!playerRef.current || !this.cursors) return;
  
    if (this.cursors.left.isDown) {
      playerRef.current.setAccelerationX(-600);
    } else if (this.cursors.right.isDown) {
      playerRef.current.setAccelerationX(600);
    } else {
      playerRef.current.setAccelerationX(0);
    }
  
    if (this.cursors.up.isDown && playerRef.current.body.touching.down) {
      playerRef.current.setVelocityY(-600);
    }
  
    if (playerRef.current.x !== previousPosition.current.x || playerRef.current.y !== previousPosition.current.y) {
      socketRef.current.emit('player:update', {
        userId: playerId.current,
        x: playerRef.current.x,
        y: playerRef.current.y,
      });
      previousPosition.current = { x: playerRef.current.x, y: playerRef.current.y };
    }
  
    // draw other players
    // Object.entries(players).forEach(([id, playerData]) => {
    //   if (id !== socketRef.current.id) { 
    //     const avatar = otherPlayersRef.current[id];
    //     if (avatar) {
    //       avatar.x = playerData.x;
    //       avatar.y = playerData.y;
    //     }
    //   }
    // });
  
    // --- REMOVE THIS SECTION temporarily ---
    // const lastPlatformY = this.winText.y - 1000; 
    // if (playerRef.current.y < lastPlatformY) {
    //   setShowOverlay(true);
    // } else {
    //   setShowOverlay(false);
    // }
  };
  

  return (
    <div id="game-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {showOverlay && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '36px',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          End for now. New levels coming soon!
        </div>
      )}
    </div>
  );
};

export default JumpGame;
