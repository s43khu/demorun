import { generateLevel1 } from "./level1";
import { generateLevel2 } from "./level2";

export function loadLevel(screenWidth, screenHeight) {
  const level1Platforms = generateLevel1(screenWidth, screenHeight);
  const level2Platforms = generateLevel2(screenWidth, screenHeight);

  return [...level1Platforms, ...level2Platforms];
}
