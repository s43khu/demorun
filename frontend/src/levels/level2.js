export function generateLevel2(screenWidth, screenHeight) {
  const level1EndHeight = screenHeight - 1950;

  const platforms = [
    {
      x: screenWidth / 2,
      y: level1EndHeight - 100,
      tile: "groundTile",
      tilesCount: 5,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 250,
      tile: "groundTile",
      tilesCount: 4,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 400,
      tile: "groundTile",
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 550,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 700,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 850,
      tile: "jumpTile",
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 - 200,
      y: level1EndHeight - 1000,
      tile: "jumpTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 250,
      y: level1EndHeight - 1150,
      tile: "jumpTile",
      tilesCount: 4,
    },
    {
      x: screenWidth / 2 - 120,
      y: level1EndHeight - 1300,
      tile: "platformTile",
      tilesCount: 6,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 1450,
      tile: "platformTile",
      tilesCount: 5,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 1600,
      tile: "platformTile",
      tilesCount: 4,
    },
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 1800,
      tile: "platformTile",
      tilesCount: 6,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 1950,
      tile: "platformTile",
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 - 150,
      y: level1EndHeight - 2100,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 200,
      y: level1EndHeight - 2250,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 100,
      y: level1EndHeight - 2400,
      tile: "jumpTile",
      tilesCount: 3,
    },
    {
      x: screenWidth / 2 + 120,
      y: level1EndHeight - 2550,
      tile: "jumpTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 - 200,
      y: level1EndHeight - 2700,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2 + 150,
      y: level1EndHeight - 2850,
      tile: "dangerTile",
      tilesCount: 2,
    },
    {
      x: screenWidth / 2,
      y: level1EndHeight - 3000,
      tile: "groundTile",
      tilesCount: 5,
    },
  ];

  return platforms;
}
