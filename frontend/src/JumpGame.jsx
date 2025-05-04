import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { io } from 'socket.io-client';
import bricks from './assets/bricks.png';
import dirt from './assets/Ground/Dirt/dirt.png';
import dirt_left from './assets/Ground/Dirt/dirtCliff_left.png';
import dirt_right from './assets/Ground/Dirt/dirtCliff_right.png';
import alienBiege_walk1 from './assets/Players/Variable sizes/Beige/alienBiege_walk1.png';
import alienBiege_walk2 from './assets/Players/Variable sizes/Beige/alienBiege_walk2.png';
import alienBiege_jump from './assets/Players/Variable sizes/Beige/alienBiege_jump.png';
import alienBiege_stand from './assets/Players/Variable sizes/Beige/alienBiege_stand.png';
import { loadLevel } from './levels/levelManager';
import FuzzyText from './animations/FuzzyText';

const JumpGame = () => {
  const gameRef = useRef(null);
  const socketRef = useRef(null);
  const playerRef = useRef(null);
  const otherPlayersRef = useRef({});
  const [showOverlay, setShowOverlay] = useState(false);
  const previousPosition = useRef({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState({});
  const playerName = localStorage.getItem('playerName') || 'Player';
  const projectilesRef = useRef([]);
  const lastShootTime = useRef(Date.now());

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

  const getRandomTint = () => {
    const randomColor = Math.floor(Math.random() * 0xffffff); 
    return randomColor;
  };

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL);
    socketRef.current.emit('player:reconnect', {
      userId: playerId.current,
      name: playerName,
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
      parent: 'game-container',
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
    
      Object.entries(allPlayers).forEach(([id, data]) => {
        if (id !== socketRef.current.id) {
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
    this.load.image('player_walk1', alienBiege_walk1);
    this.load.image('player_walk2', alienBiege_walk2);
    this.load.image('player_jump', alienBiege_jump);
    this.load.image('player_stand', alienBiege_stand);
    this.load.image('platform', 'assets/platform.png');
    this.load.image('groundTileM', dirt);
    this.load.image('groundTileR', dirt_right);
    this.load.image('groundTileL', dirt_left);
  };

  const create = async function () {
    const screenWidth = 2000;
    const screenHeight = 6000;
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
  
    const levelData = loadLevel(screenWidth, screenHeight);
    levelData.forEach(({ x, y, tile, tilesCount = 3 }) => {
      for (let i = 0; i < tilesCount; i++) {
        const tileSpacing = 18;
        let tileKey = tile;
        if (i === 0) tileKey = 'groundTileL';
        else if (i === tilesCount - 1) tileKey = 'groundTileR';
        else tileKey = 'groundTileM';
  
        const tileSprite = platforms.create(x + i * tileSpacing, y, tileKey);
        tileSprite.setScale(0.5, 0.3).refreshBody();
      }
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
    playerRef.current.setPosition(lastPosition.x, lastPosition.y);

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
  
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.world.wrap(playerRef.current, 5);
    this.cameras.main.startFollow(playerRef.current, true, 0.05, 0.05);

    socketRef.current.emit('player:reconnect', {
      userId: playerId.current,
      name: playerName,
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
      playerRef.current.anims.play('jump');
      playerRef.current.setVelocityY(-550);
    }
  
    if (!(this.cursors.up.isDown && playerRef.current.body.touching.down)) {
      playerRef.current.setVelocityY(playerRef.current.body.velocity.y);
    }
  
    if (
      playerRef.current.x !== previousPosition.current.x ||
      playerRef.current.y !== previousPosition.current.y
    ) {
      socketRef.current.emit('player:update', {
        userId: playerId.current,
        name: playerName,
        x: playerRef.current.x,
        y: playerRef.current.y,
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
        backgroundImage: `url(${bricks})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isLoading && (
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
          LOADING>>>
        </FuzzyText>
      )}
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
