import Phaser from 'phaser';

import { drawLampGroundReflection, drawStreetLamp } from './createFujiBackdrop';

export const ACT2_START_X = 900;
export const FLOWER_SHOP_X = 1240;
export const ACT2_END_X = 1700;
export const ACT3_START_X = 1700;
export const ACT3_END_X = 3500;
export const ACT3_LAMP_X = 2480;

export type Act3Environment = {
  update(progress: number): void;
};

export function createAct2Backdrop(scene: Phaser.Scene): void {
  const buildings = scene.add.graphics().setDepth(-4);
  buildings.fillStyle(0x17182b);
  buildings.fillRect(ACT2_START_X, 145, 650, 60);
  buildings.fillRect(1520, 157, 120, 48);
  buildings.fillRect(1620, 169, 100, 36);
  buildings.fillRect(1705, 183, 82, 22);
  buildings.fillRect(1772, 193, 116, 12);

  for (let x = 920; x < ACT2_END_X; x += 72) {
    const height = 30 + ((x / 72) % 3) * 15;
    buildings.fillStyle(x % 2 === 0 ? 0x1d1a30 : 0x211a31);
    buildings.fillRect(x, 205 - height, 56, height);
    buildings.fillStyle(x % 3 === 0 ? 0xd69b62 : 0x7e708d);
    buildings.fillRect(x + 11, 178, 2, 2);
    buildings.fillRect(x + 34, 190, 2, 2);
  }

  buildings.fillStyle(0x2c203a);
  buildings.fillRect(ACT2_START_X, 171, 650, 4);
  buildings.fillRect(1520, 178, 110, 3);
  buildings.fillRect(1620, 188, 82, 3);
  buildings.fillStyle(0x48304f);
  buildings.fillRect(ACT2_START_X, 207, 650, 3);
  buildings.fillRect(1520, 210, 190, 3);

  const reflections = scene.add.graphics().setDepth(-9);
  for (const lampX of [970, 1580]) {
    drawStreetLamp(scene, lampX);
    drawLampGroundReflection(reflections, lampX);
  }

  for (const x of [1330, 1500, 1645]) {
    drawBellflower(reflections, x, 229);
  }
}

export function createAct3Backdrop(scene: Phaser.Scene): Act3Environment {
  const sunset = scene.add.graphics().setScrollFactor(0).setDepth(-37);
  const skyBands = [
    { y: 0, height: 54, color: 0x1d3f78 },
    { y: 54, height: 38, color: 0x805497 },
    { y: 92, height: 34, color: 0xe36d82 },
    { y: 126, height: 31, color: 0xf58b50 },
    { y: 157, height: 25, color: 0xffcf82 },
  ];
  for (const band of skyBands) {
    sunset.fillStyle(band.color, 1);
    sunset.fillRect(0, band.y, 480, band.height);
  }
  sunset.setBlendMode(Phaser.BlendModes.SCREEN);
  sunset.setAlpha(0);

  // A shape-matched warm layer colors the mountain without washing out the sky.
  const mountainTint = scene.add
    .graphics()
    .setScrollFactor(0.08)
    .setDepth(-34)
    .setPosition(-30, 0);
  drawMountainSunsetTint(mountainTint);
  mountainTint.setAlpha(0);

  const distant = scene.add.graphics().setScrollFactor(0.3).setDepth(-23);
  distant.fillStyle(0x3d4b5e);
  distant.fillTriangle(1500, 205, 1740, 145, 1990, 205);
  distant.fillTriangle(1810, 205, 2050, 161, 2300, 205);
  distant.fillTriangle(2140, 205, 2380, 132, 2660, 205);
  distant.fillStyle(0x4a5d62);
  distant.fillRect(2320, 177, 1130, 28);
  distant.fillStyle(0xc68267, 0.34);
  distant.fillRect(2320, 177, 1130, 3);

  const ground = scene.add.graphics().setDepth(-8);
  drawSnowToSpringGround(ground);
  drawSnowTrees(ground);
  drawCherryTrees(ground);
  drawRailway(ground);
  drawStreetLamp(scene, ACT3_LAMP_X);
  drawLampGroundReflection(ground, ACT3_LAMP_X);

  return {
    update(progress: number): void {
      const amount = Phaser.Math.Clamp(progress, 0, 1);
      sunset.setAlpha(amount * 1.05);
      mountainTint.setAlpha(amount);
    },
  };
}

function drawSnowToSpringGround(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x64856c);
  g.fillRect(1540, 205, 1960, 65);

  // A jagged, stepped snow edge prevents a hard vertical season boundary.
  g.fillStyle(0xd4dfe1);
  g.beginPath();
  g.moveTo(1540, 205);
  g.lineTo(2180, 205);
  g.lineTo(2228, 212);
  g.lineTo(2205, 220);
  g.lineTo(2268, 229);
  g.lineTo(2230, 238);
  g.lineTo(2292, 247);
  g.lineTo(2214, 270);
  g.lineTo(1920, 270);
  g.lineTo(1858, 263);
  g.lineTo(1810, 268);
  g.lineTo(1760, 255);
  g.lineTo(1708, 262);
  g.lineTo(1662, 246);
  g.lineTo(1618, 252);
  g.lineTo(1578, 238);
  g.lineTo(1540, 244);
  g.closePath();
  g.fillPath();
  g.fillStyle(0xe9eff0);
  g.fillRect(1760, 207, 360, 6);
  g.fillRect(1842, 219, 300, 5);
  g.fillRect(1930, 229, 230, 4);
  g.fillStyle(0xbad0d1);
  g.fillRect(2100, 239, 114, 3);

  // Scattered snow patches dissolve into the grass.
  g.fillStyle(0xdbe4e3, 0.86);
  g.fillRect(2232, 207, 104, 6);
  g.fillRect(2270, 216, 79, 5);
  g.fillRect(2318, 225, 54, 4);
  g.fillRect(2360, 232, 34, 3);
  g.fillStyle(0x789777);
  g.fillRect(2298, 211, 90, 6);
  g.fillRect(2388, 217, 72, 5);
  g.fillRect(2458, 213, 122, 6);

  // The road is a cool reflective strip instead of yellow earth.
  g.fillStyle(0x526765);
  g.fillRect(1480, 236, 2020, 34);
  g.fillStyle(0xd4dfe0, 0.9);
  g.fillRect(1480, 236, 740, 34);
  g.fillStyle(0xaebfc0, 0.8);
  g.fillRect(2210, 236, 82, 5);
  g.fillRect(2240, 243, 54, 4);
  g.fillStyle(0x687a77, 0.8);
  for (let x = 2350; x < ACT3_END_X; x += 72) {
    g.fillRect(x, 252, 42, 2);
  }
  g.fillStyle(0xf0ac70, 0.2);
  g.fillRect(2384, 242, 91, 3);
  g.fillRect(2530, 259, 76, 3);
  g.fillRect(2820, 247, 112, 2);
  g.fillRect(3150, 261, 83, 3);
  g.fillStyle(0xffcf96, 0.14);
  g.fillRect(2425, 247, 42, 2);
  g.fillRect(2880, 254, 58, 2);
  g.fillRect(3245, 241, 37, 2);

  // Jagged wet slush bands cover the old scene seam.
  const slushEdges = [1658, 1614, 1578, 1548, 1518, 1498, 1516, 1536];
  const slushEnds = [1716, 1748, 1788, 1738, 1806, 1762, 1796, 1770];
  for (let row = 0; row < slushEdges.length; row += 1) {
    const y = 205 + row * 8;
    const left = slushEdges[row];
    g.fillStyle(row % 2 === 0 ? 0x718083 : 0x91a0a1, 0.72);
    g.fillRect(left, y, slushEnds[row] - left, 8);
  }
  g.fillStyle(0xdde6e6, 0.75);
  g.fillRect(1596, 208, 74, 4);
  g.fillRect(1638, 217, 53, 4);
  g.fillRect(1672, 226, 36, 3);
  g.fillRect(1738, 235, 48, 4);
  g.fillRect(1712, 243, 61, 4);

  for (const x of [2245, 2308, 2362, 2418, 2474, 2542]) {
    g.fillStyle(0x6f9275);
    g.fillRect(x, 229, 3, 5);
    g.fillRect(x + 6, 227, 2, 7);
    g.fillRect(x - 4, 231, 3, 3);
    g.fillStyle(0xd9e2e0, 0.8);
    g.fillRect(x - 5, 227, 4, 2);
  }
  for (const x of [1760, 1880, 2040, 2190, 2360]) {
    drawBellflower(g, x, 232);
  }
}

function drawSnowTrees(g: Phaser.GameObjects.Graphics): void {
  for (const x of [1810, 1970, 2190, 2310]) {
    g.fillStyle(0x35484d);
    g.fillRect(x, 166, 5, 53);
    g.fillRect(x - 17, 177, 20, 3);
    g.fillRect(x + 4, 184, 17, 3);
    g.fillRect(x - 7, 192, 12, 3);
    g.fillRect(x - 3, 172, 13, 3);
    g.fillStyle(0xdce6e6);
    g.fillRect(x - 18, 175, 20, 3);
    g.fillRect(x + 2, 183, 19, 2);
    g.fillRect(x - 8, 190, 8, 2);
    g.fillRect(x - 4, 168, 15, 3);
  }
}

function drawMountainSunsetTint(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0xe98068, 0.55);
  g.beginPath();
  g.moveTo(-90, 196);
  g.lineTo(24, 191);
  g.lineTo(108, 181);
  g.lineTo(178, 163);
  g.lineTo(231, 137);
  g.lineTo(268, 105);
  g.lineTo(284, 80);
  g.lineTo(289, 65);
  g.lineTo(294, 63);
  g.lineTo(312, 62);
  g.lineTo(322, 77);
  g.lineTo(338, 104);
  g.lineTo(364, 132);
  g.lineTo(400, 155);
  g.lineTo(451, 172);
  g.lineTo(516, 185);
  g.lineTo(610, 194);
  g.lineTo(690, 196);
  g.closePath();
  g.fillPath();

  g.fillStyle(0xffb7c3, 0.58);
  g.beginPath();
  g.moveTo(289, 65);
  g.lineTo(294, 63);
  g.lineTo(312, 62);
  g.lineTo(322, 77);
  g.lineTo(338, 104);
  g.lineTo(345, 112);
  g.lineTo(335, 108);
  g.lineTo(338, 116);
  g.lineTo(327, 112);
  g.lineTo(320, 121);
  g.lineTo(310, 113);
  g.lineTo(301, 121);
  g.lineTo(293, 112);
  g.lineTo(284, 118);
  g.lineTo(276, 107);
  g.lineTo(267, 105);
  g.lineTo(273, 92);
  g.lineTo(282, 79);
  g.closePath();
  g.fillPath();
}

function drawCherryTrees(g: Phaser.GameObjects.Graphics): void {
  drawCherryTree(g, 2330, 0.88);
  drawCherryTree(g, 2600, 1.08);
  drawCherryTree(g, 2860, 1.3);
  drawCherryTree(g, 3250, 0.94);
  drawCherryTree(g, 3420, 1.22);
}

function drawCherryTree(
  g: Phaser.GameObjects.Graphics,
  x: number,
  scale: number,
): void {
  const offset = (value: number): number => Math.round(value * scale);
  const thickness = (value: number): number =>
    Math.max(1, Math.round(value * scale));
  const top = 205;

  g.fillStyle(0x423139);
  g.fillRect(
    x - thickness(3),
    top - thickness(45),
    thickness(7),
    thickness(45),
  );
  g.fillRect(
    x - thickness(20),
    top - thickness(38),
    thickness(23),
    thickness(4),
  );
  g.fillRect(
    x + thickness(2),
    top - thickness(44),
    thickness(25),
    thickness(4),
  );
  g.fillRect(
    x - thickness(30),
    top - thickness(48),
    thickness(20),
    thickness(4),
  );
  g.fillRect(
    x + thickness(10),
    top - thickness(54),
    thickness(23),
    thickness(4),
  );
  g.fillRect(
    x - thickness(8),
    top - thickness(57),
    thickness(16),
    thickness(4),
  );

  const clusters = [
    [-42, -64, 28, 14, 0x96566d],
    [-18, -72, 37, 18, 0xc86f8a],
    [12, -67, 33, 17, 0xb96382],
    [34, -57, 24, 14, 0x8f536e],
    [-50, -53, 25, 13, 0xa95f76],
    [-25, -57, 34, 15, 0xdc87a1],
    [4, -55, 35, 14, 0xcf7895],
    [29, -48, 21, 12, 0xa95d77],
    [-39, -44, 29, 12, 0xc3718b],
    [-12, -47, 33, 14, 0xe59ab0],
    [16, -41, 31, 12, 0xd9859f],
    [36, -43, 18, 10, 0xb96c84],
  ];

  for (const [dx, dy, width, height, color] of clusters) {
    g.fillStyle(color);
    g.fillRect(
      x + offset(dx),
      top + offset(dy),
      thickness(width),
      thickness(height),
    );
  }

  g.fillStyle(0xf2b5c5);
  for (let index = 0; index < clusters.length; index += 1) {
    const [dx, dy, width] = clusters[index];
    g.fillRect(
      x + offset(dx + width * 0.45),
      top + offset(dy + 2),
      thickness(5),
      thickness(3),
    );
    if (index % 2 === 0) {
      g.fillRect(
        x + offset(dx + width - 7),
        top + offset(dy + 7),
        thickness(4),
        thickness(2),
      );
    }
  }

  g.fillStyle(0xe9a6b7, 0.85);
  g.fillRect(x - offset(52), top - offset(78), 3, 2);
  g.fillRect(x + offset(48), top - offset(72), 3, 2);
  g.fillRect(x + offset(29), top - offset(84), 2, 2);
}

function drawRailway(g: Phaser.GameObjects.Graphics): void {
  g.fillStyle(0x344347);
  g.fillRect(2330, 202, 1170, 4);
  g.fillRect(2330, 218, 1170, 3);
  g.fillStyle(0x8f8878);
  for (let x = 2336; x < 3500; x += 18) {
    g.fillRect(x, 205, 3, 12);
  }
  g.fillStyle(0xe6a76d, 0.18);
  g.fillRect(2330, 214, 1170, 2);
}

function drawBellflower(
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
): void {
  g.fillStyle(0x55725d);
  g.fillRect(x, y, 1, 9);
  g.fillRect(x - 4, y + 5, 4, 1);
  g.fillStyle(0xe8ebdf);
  g.fillRect(x - 4, y - 2, 3, 3);
  g.fillRect(x + 2, y - 2, 3, 3);
  g.fillRect(x - 1, y, 3, 2);
  g.fillStyle(0xc8d5c9);
  g.fillRect(x - 2, y + 2, 5, 2);
}
