import Phaser from 'phaser';

export const YIN_TIAN_ROOM_WIDTH = 480;
export const YIN_TIAN_ROOM2_END_X = 1280;
export const YIN_TIAN_ROOM3_START_X = 1280;
export const YIN_TIAN_WORLD_WIDTH = 1960;
export const YIN_TIAN_ROOM2_START_X = 500;
export const YIN_TIAN_GROUND_Y = 238;
export const YIN_TIAN_PLAYER_START_X = 64;
export const YIN_TIAN_PLAYER_END_X = 1865;
export const YIN_TIAN_CIGARETTE_X = 110;
export const YIN_TIAN_CIGARETTE_Y = 205;
export const YIN_TIAN_PHOTO_X = 174;
export const YIN_TIAN_PHOTO_Y = 188;

export type YinTianEnvironment = {
  update(delta: number): void;
};

export function createYinTianBackdrop(
  scene: Phaser.Scene,
): YinTianEnvironment {
  drawWall(scene);
  drawFloor(scene);
  drawWindow(scene);
  drawDoorway(scene);
  drawFurniture(scene);
  drawStoppedClock(scene);
  drawLivedInCorner(scene);
  drawColdWindowLight(scene);
  return createWindowRain(scene);
}

function drawWall(scene: Phaser.Scene): void {
  const wall = scene.add.graphics().setDepth(-30);
  wall.fillStyle(0x23282d);
  wall.fillRect(0, 0, YIN_TIAN_ROOM_WIDTH, 216);

  const plaster = [0x2d3236, 0x34393d, 0x3b4043, 0x292f34];
  for (let index = 0; index < 38; index += 1) {
    const x = 8 + ((index * 37) % 292);
    const y = 12 + ((index * 43) % 180);
    wall.fillStyle(plaster[index % plaster.length], 0.24);
    wall.fillRect(x, y, 18 + (index % 11), 6 + (index % 9));
  }

  const peeledPatches = [
    [26, 68, 31, 8],
    [33, 76, 18, 5],
    [234, 105, 38, 7],
    [246, 112, 19, 4],
    [145, 34, 26, 6],
    [151, 40, 13, 3],
  ] as const;
  for (const [x, y, width, height] of peeledPatches) {
    wall.fillStyle(0x505456, 0.28);
    wall.fillRect(x, y, width, height);
    wall.fillStyle(0x3c4145, 0.3);
    wall.fillRect(x + 4, y + height, width - 10, 2);
  }

  wall.fillStyle(0x10151a, 0.38);
  wall.fillRect(0, 0, 104, 216);
  wall.fillStyle(0x0b1015, 0.18);
  wall.fillRect(104, 0, 92, 216);
  wall.fillStyle(0xaeb8ba, 0.045);
  wall.fillRect(292, 24, 168, 190);

  wall.fillStyle(0x171c20, 0.34);
  for (const [x, y, height] of [
    [74, 126, 22],
    [97, 96, 13],
    [257, 166, 18],
  ] as const) {
    wall.fillRect(x, y, 1, height);
  }
}

function drawFloor(scene: Phaser.Scene): void {
  const floor = scene.add.graphics().setDepth(-12);
  floor.fillStyle(0x231b18);
  floor.fillRect(0, 211, YIN_TIAN_ROOM_WIDTH, 59);

  const planks = [0x2f2420, 0x352823, 0x2a211e, 0x3b2c26, 0x30231f];
  for (let y = 214; y < 270; y += 5) {
    const color = planks[Math.floor((y - 214) / 5) % planks.length];
    floor.fillStyle(color, 0.92);
    floor.fillRect(0, y, YIN_TIAN_ROOM_WIDTH, 4);
    floor.fillStyle(0x171311, 0.46);
    floor.fillRect(0, y + 4, YIN_TIAN_ROOM_WIDTH, 1);
  }
  for (let x = 18; x < YIN_TIAN_ROOM_WIDTH; x += 58) {
    floor.fillStyle(0x171311, 0.24);
    floor.fillRect(x, 214, 1, 56);
  }
  floor.fillStyle(0x6c5547, 0.13);
  floor.fillRect(0, 211, YIN_TIAN_ROOM_WIDTH, 3);
}

function drawWindow(scene: Phaser.Scene): void {
  const sky = scene.add.graphics().setDepth(-21);
  const bands = [
    { y: 48, height: 36, color: 0xbec7c8 },
    { y: 84, height: 36, color: 0xaeb9bc },
    { y: 120, height: 38, color: 0x9ea9ad },
    { y: 158, height: 50, color: 0x8e999e },
  ];
  for (const band of bands) {
    sky.fillStyle(band.color);
    sky.fillRect(326, band.y, 132, band.height);
  }
  sky.fillStyle(0xd7dddd, 0.22);
  sky.fillRect(326, 62, 132, 8);
  sky.fillRect(326, 113, 132, 5);

  const distant = scene.add.graphics().setDepth(-19);
  distant.fillStyle(0x727d81, 0.4);
  distant.fillRect(326, 177, 132, 30);
  for (let x = 330; x < 456; x += 18) {
    const height = 8 + ((x / 3) % 13);
    distant.fillStyle(0x697579, 0.36);
    distant.fillRect(x, 207 - height, 12, height);
  }

  const frame = scene.add.graphics().setDepth(-8);
  frame.fillStyle(0x171b1f);
  frame.fillRect(316, 38, 152, 8);
  frame.fillRect(316, 199, 152, 13);
  frame.fillRect(316, 38, 8, 174);
  frame.fillRect(460, 38, 8, 174);
  frame.fillRect(374, 46, 4, 153);
  frame.fillRect(438, 46, 4, 153);
  frame.fillStyle(0x3f4548);
  frame.fillRect(320, 42, 140, 3);
  frame.fillRect(320, 199, 140, 3);
  frame.fillStyle(0x252b2f);
  frame.fillRect(308, 207, 168, 6);
  frame.fillStyle(0x596164, 0.45);
  frame.fillRect(324, 46, 2, 153);
  frame.fillRect(446, 46, 2, 153);
}

function drawDoorway(scene: Phaser.Scene): void {
  const door = scene.add.graphics().setDepth(-9);
  door.fillStyle(0x0f1317);
  door.fillRect(12, 132, 48, 106);
  door.fillStyle(0x252a2d);
  door.fillRect(17, 137, 38, 101);
  door.fillStyle(0x191d21);
  door.fillRect(21, 141, 30, 93);
  door.fillStyle(0x0b0e11);
  door.fillRect(35, 141, 18, 93);
  door.fillStyle(0x4c5355, 0.5);
  door.fillRect(32, 187, 2, 2);
}

function drawFurniture(scene: Phaser.Scene): void {
  const furniture = scene.add.graphics().setDepth(-4);
  furniture.fillStyle(0x1d1716);
  furniture.fillRect(38, 205, 154, 7);
  furniture.fillStyle(0x49352c);
  furniture.fillRect(41, 203, 148, 5);
  furniture.fillStyle(0x2b211d);
  furniture.fillRect(49, 209, 5, 28);
  furniture.fillRect(179, 209, 5, 28);
  furniture.fillStyle(0x5b4438, 0.45);
  furniture.fillRect(46, 211, 136, 2);

  furniture.fillStyle(0x161417);
  furniture.fillRect(91, 201, 25, 2);
  furniture.fillStyle(0xd7d2c7);
  furniture.fillRect(92, 200, 18, 2);
  furniture.fillStyle(0x4d4842);
  furniture.fillRect(107, 200, 4, 2);
  furniture.fillStyle(0x8e5c42);
  furniture.fillRect(109, 200, 2, 1);

}

function drawStoppedClock(scene: Phaser.Scene): void {
  const clock = scene.add.graphics().setDepth(-2);
  clock.fillStyle(0x111519);
  clock.fillCircle(254, 70, 16);
  clock.fillStyle(0x65696a);
  clock.fillCircle(254, 70, 13);
  clock.fillStyle(0x9b9b94);
  clock.fillCircle(254, 70, 11);
  clock.fillStyle(0x252a2d);
  for (const [x, y] of [
    [254, 62],
    [262, 70],
    [254, 78],
    [246, 70],
  ] as const) {
    clock.fillRect(x - 1, y - 1, 2, 2);
  }
  clock.fillRect(254, 70, 7, 1);
  clock.fillRect(254, 70, 5, 2);
  clock.fillStyle(0x2b2f31);
  clock.fillRect(253, 69, 2, 2);
}

function drawLivedInCorner(scene: Phaser.Scene): void {
  const belongings = scene.add.graphics().setDepth(-1);
  belongings.fillStyle(0x1b1718);
  belongings.fillRect(222, 217, 34, 20);
  belongings.fillStyle(0x4b3830);
  belongings.fillRect(226, 214, 26, 21);
  belongings.fillStyle(0x6b4d3d);
  belongings.fillRect(229, 217, 20, 3);
  belongings.fillStyle(0x2c2423);
  belongings.fillRect(237, 214, 4, 4);
  belongings.fillRect(228, 233, 3, 4);
  belongings.fillRect(248, 233, 3, 4);

  belongings.fillStyle(0x29272b);
  belongings.fillRect(270, 232, 23, 5);
  belongings.fillRect(276, 227, 18, 5);
  belongings.fillStyle(0x46454a);
  belongings.fillRect(283, 224, 10, 4);
  belongings.fillStyle(0x35383d);
  belongings.fillRect(258, 234, 13, 3);
}

function drawColdWindowLight(scene: Phaser.Scene): void {
  const light = scene.add.graphics().setDepth(-3);
  for (let x = 84; x < 464; x += 8) {
    const progress = Phaser.Math.Clamp((x - 84) / 380, 0, 1);
    light.fillStyle(0xdce4e4, 0.016 + progress * 0.1);
    light.fillRect(x, 212, 8, 38);
  }
  light.fillStyle(0xe5ecec, 0.1);
  light.beginPath();
  light.moveTo(308, 211);
  light.lineTo(456, 211);
  light.lineTo(401, 246);
  light.lineTo(246, 246);
  light.closePath();
  light.fillPath();
  light.fillStyle(0xb9c8cb, 0.08);
  light.fillRect(280, 218, 118, 5);
  light.fillRect(256, 229, 96, 4);
}

function createWindowRain(scene: Phaser.Scene): YinTianEnvironment {
  const rain = scene.add.graphics().setDepth(-17);
  const drops = Array.from({ length: 18 }, (_, index) => ({
    x: 331 + ((index * 47) % 122),
    y: 53 + ((index * 31) % 149),
    speed: 24 + (index % 5) * 6,
    length: 2 + (index % 3),
  }));

  return {
    update(delta: number): void {
      rain.clear();
      rain.fillStyle(0x687579, 0.48);
      for (const drop of drops) {
        drop.y += drop.speed * (delta / 1000);
        if (drop.y > 202) {
          drop.y = 52;
        }
        rain.fillRect(Math.round(drop.x), Math.round(drop.y), 1, drop.length);
      }
    },
  };
}
