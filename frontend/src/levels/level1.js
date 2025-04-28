export function generateLevel1(screenWidth, screenHeight) {
  const level1EndHeight = screenHeight;
  const platforms = [
    { x: screenWidth / 2, y: level1EndHeight - 100, color: 0x00ff00 },
    { x: screenWidth / 2 + 150, y: level1EndHeight - 250, color: 0x00ff00 },
    { x: screenWidth / 2 - 100, y: level1EndHeight - 400, color: 0x00ff00 },
    { x: screenWidth / 2 + 120, y: level1EndHeight - 550, color: 0x00ff00 },
    { x: screenWidth / 2 - 150, y: level1EndHeight - 700, color: 0x00ff00 },
    { x: screenWidth / 2, y: level1EndHeight - 850, color: 0x00ff00 },
    { x: screenWidth / 2 - 200, y: level1EndHeight - 1000, color: 0xff0000 },
    { x: screenWidth / 2 + 250, y: level1EndHeight - 1150, color: 0xff0000 },
    { x: screenWidth / 2 - 120, y: level1EndHeight - 1300, color: 0x0000ff },
    { x: screenWidth / 2 + 150, y: level1EndHeight - 1450, color: 0x0000ff },
    { x: screenWidth / 2 - 100, y: level1EndHeight - 1600, color: 0xffff00 },
    { x: screenWidth / 2 + 200, y: level1EndHeight - 1800, color: 0xffff00 },
    { x: screenWidth / 2, y: level1EndHeight - 1950, color: 0xffff00 },
  ];

  return platforms;
}
