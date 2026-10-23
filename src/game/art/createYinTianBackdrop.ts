import Phaser from 'phaser';

export const YIN_TIAN_ROOM_WIDTH = 480;
export const YIN_TIAN_ROOM2_END_X = 1280;
export const YIN_TIAN_ROOM3_START_X = 1280;
export const YIN_TIAN_WORLD_WIDTH = 1960;
export const YIN_TIAN_ROOM2_START_X = 500;
export const YIN_TIAN_GROUND_Y = 238;
export const YIN_TIAN_PLAYER_START_X = 122;
export const YIN_TIAN_PLAYER_END_X = 1865;
export const YIN_TIAN_CIGARETTE_X = 222;
export const YIN_TIAN_CIGARETTE_Y = 201;
export const YIN_TIAN_PHOTO_X = 284;
export const YIN_TIAN_PHOTO_Y = 188;
export const YIN_TIAN_CURTAIN_X = 82;

export type YinTianEnvironment = {
  update(delta: number): void;
  setCurtainOpen(progress: number): void;
};

export function createYinTianBackdrop(
  scene: Phaser.Scene,
): YinTianEnvironment {
  drawWall(scene);
  drawFloor(scene);
  const window = drawWindow(scene);
  drawFurniture(scene);
  drawStoppedClock(scene);
  drawLivedInCorner(scene);
  drawRoom2ExitDoor(scene);
  const windowLight = drawColdWindowLight(scene);
  return createWindowAtmosphere(scene, window, windowLight);
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

type WindowVisuals = {
  rightCurtain: Phaser.GameObjects.Graphics;
  beam: Phaser.GameObjects.Graphics;
};

function drawWindow(scene: Phaser.Scene): WindowVisuals {
  const sky = scene.add.graphics().setDepth(-21);
  const bands = [
    { y: 48, height: 36, color: 0xbec7c8 },
    { y: 84, height: 36, color: 0xaeb9bc },
    { y: 120, height: 38, color: 0x9ea9ad },
    { y: 158, height: 50, color: 0x8e999e },
  ];
  for (const band of bands) {
    sky.fillStyle(band.color);
    sky.fillRect(20, band.y, 132, band.height);
  }
  sky.fillStyle(0xd7dddd, 0.22);
  sky.fillRect(20, 62, 132, 8);
  sky.fillRect(20, 113, 132, 5);

  const distant = scene.add.graphics().setDepth(-19);
  distant.fillStyle(0x727d81, 0.4);
  distant.fillRect(20, 177, 132, 30);
  for (let x = 24; x < 150; x += 18) {
    const height = 8 + ((x / 3) % 13);
    distant.fillStyle(0x697579, 0.36);
    distant.fillRect(x, 207 - height, 12, height);
  }

  const frame = scene.add.graphics().setDepth(-8);
  frame.fillStyle(0x171b1f);
  frame.fillRect(10, 38, 152, 8);
  frame.fillRect(10, 199, 152, 13);
  frame.fillRect(10, 38, 8, 174);
  frame.fillRect(154, 38, 8, 174);
  frame.fillRect(78, 46, 4, 153);
  frame.fillRect(142, 46, 4, 153);
  frame.fillStyle(0x3f4548);
  frame.fillRect(14, 42, 140, 3);
  frame.fillRect(14, 199, 140, 3);
  frame.fillStyle(0x252b2f);
  frame.fillRect(2, 207, 168, 6);
  frame.fillStyle(0x596164, 0.45);
  frame.fillRect(18, 46, 2, 153);
  frame.fillRect(150, 46, 2, 153);

  const leftCurtain = scene.add.graphics().setDepth(-7);
  leftCurtain.fillStyle(0x151a21);
  leftCurtain.fillRect(20, 49, 58, 158);
  leftCurtain.fillStyle(0x252b35);
  leftCurtain.fillRect(24, 52, 4, 152);
  leftCurtain.fillRect(39, 52, 3, 152);
  leftCurtain.fillRect(55, 52, 3, 152);
  leftCurtain.fillStyle(0x3b424c, 0.34);
  leftCurtain.fillRect(34, 55, 2, 146);
  leftCurtain.fillRect(65, 55, 2, 146);

  const rightCurtain = scene.add.graphics().setPosition(82, 50).setDepth(-7);
  rightCurtain.fillStyle(0x171c24);
  rightCurtain.fillRect(0, 0, 70, 157);
  rightCurtain.fillStyle(0x282f39);
  rightCurtain.fillRect(5, 3, 4, 151);
  rightCurtain.fillRect(22, 3, 3, 151);
  rightCurtain.fillRect(40, 3, 3, 151);
  rightCurtain.fillRect(59, 3, 3, 151);
  rightCurtain.fillStyle(0x3f4650, 0.32);
  rightCurtain.fillRect(14, 7, 2, 143);
  rightCurtain.fillRect(50, 7, 2, 143);

  const curtainMaskSource = scene.make.graphics({ x: 0, y: 0, add: false });
  curtainMaskSource.fillStyle(0xffffff);
  curtainMaskSource.fillRect(20, 48, 132, 158);
  rightCurtain.setMask(curtainMaskSource.createGeometryMask());

  const rod = scene.add.graphics().setDepth(-6);
  rod.fillStyle(0x0b0e12);
  rod.fillRect(8, 44, 156, 4);
  rod.fillStyle(0x686157, 0.52);
  rod.fillRect(12, 44, 148, 1);

  const beam = scene.add.graphics().setDepth(11);
  return { rightCurtain, beam };
}

function drawFurniture(scene: Phaser.Scene): void {
  const furniture = scene.add.graphics().setDepth(-4);
  furniture.fillStyle(0x1d1716);
  furniture.fillRect(174, 205, 164, 7);
  furniture.fillStyle(0x49352c);
  furniture.fillRect(177, 203, 158, 5);
  furniture.fillStyle(0x2b211d);
  furniture.fillRect(185, 209, 5, 28);
  furniture.fillRect(326, 209, 5, 28);
  furniture.fillStyle(0x5b4438, 0.45);
  furniture.fillRect(182, 211, 146, 2);

  furniture.fillStyle(0x161417);
  furniture.fillRect(207, 200, 25, 2);
  furniture.fillStyle(0xd7d2c7);
  furniture.fillRect(208, 199, 18, 2);
  furniture.fillStyle(0x4d4842);
  furniture.fillRect(223, 199, 4, 2);
  furniture.fillStyle(0x8e5c42);
  furniture.fillRect(225, 199, 2, 1);

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
  belongings.fillRect(348, 217, 34, 20);
  belongings.fillStyle(0x4b3830);
  belongings.fillRect(352, 214, 26, 21);
  belongings.fillStyle(0x6b4d3d);
  belongings.fillRect(355, 217, 20, 3);
  belongings.fillStyle(0x2c2423);
  belongings.fillRect(363, 214, 4, 4);
  belongings.fillRect(354, 233, 3, 4);
  belongings.fillRect(374, 233, 3, 4);

  belongings.fillStyle(0x29272b);
  belongings.fillRect(396, 232, 23, 5);
  belongings.fillRect(402, 227, 18, 5);
  belongings.fillStyle(0x46454a);
  belongings.fillRect(409, 224, 10, 4);
  belongings.fillStyle(0x35383d);
  belongings.fillRect(384, 234, 13, 3);
}

function drawRoom2ExitDoor(scene: Phaser.Scene): void {
  const door = scene.add.graphics().setDepth(-2);
  door.fillStyle(0x0b0e12);
  door.fillRect(424, 82, 54, 132);
  door.fillStyle(0x30343a);
  door.fillRect(429, 88, 45, 121);
  door.fillStyle(0x11151a);
  door.fillRect(435, 95, 33, 114);
  door.fillStyle(0x252a30);
  door.fillRect(455, 95, 18, 114);
  door.fillStyle(0x171b20);
  door.fillRect(438, 101, 14, 101);
  door.fillStyle(0x4b3c34);
  door.fillRect(453, 101, 2, 101);
  door.fillStyle(0x8e775f);
  door.fillRect(466, 151, 3, 3);
  door.fillStyle(0x111419);
  door.fillRect(424, 209, 56, 8);
  door.fillStyle(0x5b5147, 0.32);
  door.fillRect(432, 211, 40, 2);
}

function drawColdWindowLight(
  scene: Phaser.Scene,
): Phaser.GameObjects.Graphics {
  const light = scene.add.graphics().setDepth(-3);
  for (let x = 24; x < 350; x += 8) {
    const fade = 1 - Phaser.Math.Clamp((x - 24) / 326, 0, 1);
    light.fillStyle(0xdce4e4, 0.025 + fade * 0.08);
    light.fillRect(x, 212, 8, 38);
  }
  light.fillStyle(0xe5ecec, 0.1);
  light.beginPath();
  light.moveTo(18, 211);
  light.lineTo(154, 211);
  light.lineTo(286, 258);
  light.lineTo(74, 258);
  light.closePath();
  light.fillPath();
  light.fillStyle(0xb9c8cb, 0.08);
  light.fillRect(48, 219, 188, 5);
  light.fillRect(82, 230, 149, 4);
  return light;
}

function createWindowAtmosphere(
  scene: Phaser.Scene,
  window: WindowVisuals,
  windowLight: Phaser.GameObjects.Graphics,
): YinTianEnvironment {
  const rain = scene.add.graphics().setDepth(-17);
  const drops = Array.from({ length: 18 }, (_, index) => ({
    x: 24 + ((index * 47) % 122),
    y: 53 + ((index * 31) % 149),
    speed: 24 + (index % 5) * 6,
    length: 2 + (index % 3),
  }));
  const dust = scene.add.graphics().setDepth(12);
  const dustParticles = Array.from({ length: 24 }, (_, index) => ({
    x: 82 + ((index * 19) % 126),
    y: 72 + ((index * 37) % 158),
    speed: 2 + (index % 4),
    phase: index * 0.61,
  }));
  let elapsed = 0;
  let curtainProgress = 0;

  const drawBeam = (progress: number): void => {
    const topLeft = 80 - progress * 58;
    const topRight = 85 + progress * 66;
    const bottomLeft = 144 - progress * 92;
    const bottomRight = 174 + progress * 168;
    window.beam.clear();
    window.beam.fillStyle(0xdde7e8, 0.05 + progress * 0.13);
    window.beam.beginPath();
    window.beam.moveTo(topLeft, 50);
    window.beam.lineTo(topRight, 50);
    window.beam.lineTo(bottomRight, 258);
    window.beam.lineTo(bottomLeft, 258);
    window.beam.closePath();
    window.beam.fillPath();
  };

  const setCurtainOpen = (progress: number): void => {
    curtainProgress = Phaser.Math.Clamp(progress, 0, 1);
    window.rightCurtain.x = 82 + curtainProgress * 68;
    windowLight.setAlpha(0.1 + curtainProgress * 0.9);
    drawBeam(curtainProgress);
  };
  setCurtainOpen(0);

  return {
    update(delta: number): void {
      elapsed += delta;
      rain.clear();
      rain.fillStyle(0x687579, 0.48);
      for (const drop of drops) {
        drop.y += drop.speed * (delta / 1000);
        if (drop.y > 202) {
          drop.y = 52;
        }
        rain.fillRect(Math.round(drop.x), Math.round(drop.y), 1, drop.length);
      }

      dust.clear();
      const visibleDust = 4 + Math.floor(curtainProgress * 20);
      for (let index = 0; index < visibleDust; index += 1) {
        const particle = dustParticles[index];
        particle.y -= particle.speed * (delta / 1000);
        if (particle.y < 62) {
          particle.y = 218;
        }
        const sway = Math.sin(elapsed / 900 + particle.phase) * 3;
        dust.fillStyle(
          0xdde7e8,
          0.16 + curtainProgress * 0.3,
        );
        dust.fillRect(
          Math.round(particle.x + sway),
          Math.round(particle.y),
          1,
          1,
        );
      }
    },
    setCurtainOpen,
  };
}
