// NOTE: Enhanced level data with challenges and obstacles
export const generateEnhancedLevels = (screenWidth, screenHeight) => {
  const levels = {
    platforms: [],
    hazards: [],
    collectibles: [],
    movingPlatforms: [],
    checkpoints: [],
  };

  const level1EndHeight = screenHeight;

  // TODO: Add more variety to platform spacing and heights
  // HACK: Using different tile types for visual variety

  // NOTE: Base platforms with proper spacing and borders
  const basePlatforms = [
    {
      x: screenWidth / 2,
      y: level1EndHeight - 100,
      tile: 'groundTile',
      tilesCount: 12,
    }, // NOTE: Wider base platform
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 200,
      tile: 'groundTile',
      tilesCount: 4,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 350,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 500,
      tile: 'groundTile',
      tilesCount: 5,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 650,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 800,
      tile: 'groundTile',
      tilesCount: 6,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 950,
      tile: 'groundTile',
      tilesCount: 4,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 1100,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 1250,
      tile: 'groundTile',
      tilesCount: 5,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 1400,
      tile: 'groundTile',
      tilesCount: 7,
    },
    // NOTE: Additional connecting platforms to ensure path
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 1550,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 1700,
      tile: 'groundTile',
      tilesCount: 3,
    },
    // NOTE: More platforms for better reachability
    {
      x: screenWidth / 2 + 60,
      y: level1EndHeight - 1850,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 - 60,
      y: level1EndHeight - 2000,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 + 40,
      y: level1EndHeight - 2150,
      tile: 'groundTile',
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 - 40,
      y: level1EndHeight - 2300,
      tile: 'groundTile',
      tilesCount: 3,
    },
  ];

  // NOTE: Challenging platforms with gaps - ensuring they're within bounds
  const challengePlatforms = [
    {
      x: screenWidth / 2 - 200,
      y: level1EndHeight - 1550,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 1550,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 1700,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 180,
      y: level1EndHeight - 1850,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 180,
      y: level1EndHeight - 1850,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 2000,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 2150,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 2150,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 2300,
      tile: 'groundTile',
      tilesCount: 1,
    },
    // NOTE: Additional connecting platforms for challenge section
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 2450,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 2600,
      tile: 'groundTile',
      tilesCount: 2,
    },
    // NOTE: More connecting platforms for better reachability
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 2750,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 2900,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 60,
      y: level1EndHeight - 3050,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 60,
      y: level1EndHeight - 3200,
      tile: 'groundTile',
      tilesCount: 2,
    },
  ];

  // NOTE: Moving platforms - removed for now to simplify
  const movingPlatforms = [];

  // NOTE: Hazards (spikes only) - positioned safely within bounds
  const hazards = [
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 2650,
      type: 'spike',
      width: 32,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 2800,
      type: 'spike',
      width: 32,
    },
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 3100,
      type: 'spike',
      width: 64,
    },
  ];

  // NOTE: Collectibles (coins, gems) - positioned near platforms
  const collectibles = [
    {
      x: screenWidth / 2 + 50,
      y: level1EndHeight - 250,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 50,
      y: level1EndHeight - 400,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 550,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 700,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 60,
      y: level1EndHeight - 850,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 60,
      y: level1EndHeight - 1000,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 1150,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 1300,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 70,
      y: level1EndHeight - 1450,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 70,
      y: level1EndHeight - 1600,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 90,
      y: level1EndHeight - 1750,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 90,
      y: level1EndHeight - 1900,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 + 110,
      y: level1EndHeight - 2050,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 110,
      y: level1EndHeight - 2200,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 2350,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 2500,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 2650,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 2800,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 2950,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 3100,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 130,
      y: level1EndHeight - 3250,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 130,
      y: level1EndHeight - 3400,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 90,
      y: level1EndHeight - 3550,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 90,
      y: level1EndHeight - 3700,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 + 110,
      y: level1EndHeight - 3850,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 110,
      y: level1EndHeight - 4000,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 140,
      y: level1EndHeight - 4150,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 140,
      y: level1EndHeight - 4300,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 4450,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 4600,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 4750,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 4900,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 5050,
      type: 'gem',
      value: 50,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 5200,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 5350,
      type: 'coin',
      value: 10,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 5500,
      type: 'gem',
      value: 100,
    },
  ];

  // NOTE: Checkpoints for respawn - positioned at safe locations
  const checkpoints = [];

  // BUG: Add more challenging sections
  // NOTE: Advanced challenge platforms - ensuring they're within screen bounds
  const advancedPlatforms = [
    {
      x: screenWidth / 2 - 200,
      y: level1EndHeight - 2450,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 2450,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 2600,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 250,
      y: level1EndHeight - 2750,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 250,
      y: level1EndHeight - 2750,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 2900,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 300,
      y: level1EndHeight - 3050,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 300,
      y: level1EndHeight - 3050,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 3200,
      tile: 'groundTile',
      tilesCount: 1,
    },
    // NOTE: Additional connecting platforms for advanced section
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 3350,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 3500,
      tile: 'groundTile',
      tilesCount: 2,
    },
    // NOTE: More challenging platforms
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 3650,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 3800,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 3950,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 4100,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 80,
      y: level1EndHeight - 4250,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 80,
      y: level1EndHeight - 4400,
      tile: 'groundTile',
      tilesCount: 2,
    },
  ];

  // NOTE: Final challenge platforms - within screen bounds
  const finalPlatforms = [
    {
      x: screenWidth / 2 - 300,
      y: level1EndHeight - 3350,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 300,
      y: level1EndHeight - 3350,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 3500,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 350,
      y: level1EndHeight - 3650,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 350,
      y: level1EndHeight - 3650,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 3800,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 - 400,
      y: level1EndHeight - 3950,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2 + 400,
      y: level1EndHeight - 3950,
      tile: 'groundTile',
      tilesCount: 1,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 4100,
      tile: 'groundTile',
      tilesCount: 1,
    },
    // NOTE: Additional connecting platforms for final section
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 4250,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 200,
      y: level1EndHeight - 4400,
      tile: 'groundTile',
      tilesCount: 2,
    },
    // NOTE: Extended final platforms for higher climbing
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 4550,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 4700,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 100,
      y: level1EndHeight - 4850,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 5000,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 50,
      y: level1EndHeight - 5150,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 50,
      y: level1EndHeight - 5300,
      tile: 'groundTile',
      tilesCount: 2,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 5450,
      tile: 'groundTile',
      tilesCount: 1,
    },
  ];

  levels.platforms = [
    ...basePlatforms,
    ...challengePlatforms,
    ...advancedPlatforms,
    ...finalPlatforms,
  ];

  levels.movingPlatforms = movingPlatforms;
  levels.hazards = hazards;
  levels.collectibles = collectibles;
  levels.checkpoints = checkpoints;

  return levels;
};

// NOTE: Challenge definitions for achievements
export const challenges = [
  {
    id: 'height_1000',
    name: 'Mountain Climber',
    description: 'Reach 1000m height',
    requirement: 1000,
    type: 'height',
    reward: 100,
  },
  {
    id: 'height_2000',
    name: 'Sky Walker',
    description: 'Reach 2000m height',
    requirement: 2000,
    type: 'height',
    reward: 200,
  },
  {
    id: 'height_3000',
    name: 'Cloud Surfer',
    description: 'Reach 3000m height',
    requirement: 3000,
    type: 'height',
    reward: 300,
  },
  {
    id: 'height_4000',
    name: 'Space Explorer',
    description: 'Reach 4000m height',
    requirement: 4000,
    type: 'height',
    reward: 500,
  },
  {
    id: 'height_5000',
    name: 'Cosmic Climber',
    description: 'Reach 5000m height',
    requirement: 5000,
    type: 'height',
    reward: 1000,
  },
  {
    id: 'coins_50',
    name: 'Coin Collector',
    description: 'Collect 50 coins',
    requirement: 50,
    type: 'coins',
    reward: 100,
  },
  {
    id: 'coins_100',
    name: 'Treasure Hunter',
    description: 'Collect 100 coins',
    requirement: 100,
    type: 'coins',
    reward: 200,
  },
  {
    id: 'gems_10',
    name: 'Gem Master',
    description: 'Collect 10 gems',
    requirement: 10,
    type: 'gems',
    reward: 300,
  },
  {
    id: 'jumps_100',
    name: 'Jump Master',
    description: 'Make 100 jumps',
    requirement: 100,
    type: 'jumps',
    reward: 150,
  },
  {
    id: 'jumps_500',
    name: 'Jump Legend',
    description: 'Make 500 jumps',
    requirement: 500,
    type: 'jumps',
    reward: 400,
  },
];
