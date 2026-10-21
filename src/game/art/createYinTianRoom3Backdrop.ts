import Phaser from 'phaser';

import {
  YIN_TIAN_GROUND_Y,
  YIN_TIAN_ROOM3_START_X,
  YIN_TIAN_WORLD_WIDTH,
} from './createYinTianBackdrop';

export const YIN_TIAN_WINDOW_CENTER_X = 1760;
export const YIN_TIAN_WINDOW_CENTER_Y = 145;
export const YIN_TIAN_BUTT_X = 1650;

export type YinTianRoom3Environment = {
  update(delta: number): void;
  startWeddingExit(): void;
};

export function createYinTianRoom3Backdrop(
  scene: Phaser.Scene,
): YinTianRoom3Environment {
  const wall = scene.add.graphics().setDepth(-30);
  wall.fillStyle(0x171c29);
  wall.fillRect(
    YIN_TIAN_ROOM3_START_X,
    0,
    YIN_TIAN_WORLD_WIDTH - YIN_TIAN_ROOM3_START_X,
    216,
  );
  for (let index = 0; index < 38; index += 1) {
    const x = 1290 + ((index * 37) % 650);
    const y = 12 + ((index * 41) % 188);
    wall.fillStyle(index % 2 === 0 ? 0x252b3b : 0x0e1422, 0.22);
    wall.fillRect(x, y, 12 + (index % 15), 5 + (index % 9));
  }
  wall.fillStyle(0x111827, 0.36);
  wall.fillRect(1300, 0, 250, 216);

  drawRoom3Floor(scene);
  drawRoom3Window(scene);

  const neonGlow = scene.add.graphics().setDepth(-14);
  const neon = scene.add
    .text(YIN_TIAN_WINDOW_CENTER_X, 108, '囍', {
      fontFamily: '"Fusion Pixel"',
      fontSize: '42px',
      color: '#ff354e',
      stroke: '#5b0915',
      strokeThickness: 1,
      resolution: 1,
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: '#ff1f38',
        blur: 5,
        stroke: true,
        fill: true,
      },
    })
    .setOrigin(0.5)
    .setDepth(-11);
  const male = createWindowFigure(scene, 1741, 168, 1);
  const female = createWindowFigure(scene, 1779, 168, -1);
  const streetGlow = scene.add.graphics().setDepth(-16);
  streetGlow.fillStyle(0x9b1727, 0.11);
  streetGlow.fillEllipse(1760, 243, 290, 42);
  streetGlow.fillStyle(0xe44142, 0.07);
  streetGlow.fillRect(1648, 216, 224, 24);

  let elapsed = 0;
  let walking = false;

  return {
    update(delta: number): void {
      elapsed += delta;
      const flicker = 0.72 + Math.sin(elapsed / 92) * 0.1 +
        Math.sin(elapsed / 41) * 0.035;
      neonGlow.clear();
      neonGlow.fillStyle(0xff2942, 0.1);
      neonGlow.fillRect(1698, 70, 124, 70);
      neonGlow.fillStyle(0xff4a59, 0.08);
      neonGlow.fillRect(1712, 82, 96, 45);
      neonGlow.setAlpha(flicker);
      neon.setAlpha(0.82 + flicker * 0.16);
      streetGlow.setAlpha(flicker);
    },
    startWeddingExit(): void {
      if (walking) {
        return;
      }
      walking = true;
      scene.tweens.add({
        targets: male,
        scaleX: -1,
        duration: 420,
        ease: 'Sine.easeInOut',
      });
      scene.tweens.add({
        targets: female,
        scaleX: 1,
        duration: 420,
        ease: 'Sine.easeInOut',
      });
      scene.tweens.add({
        targets: male,
        x: 1688,
        alpha: 0.24,
        duration: 3200,
        ease: 'Sine.easeInOut',
      });
      scene.tweens.add({
        targets: female,
        x: 1832,
        alpha: 0.24,
        duration: 3200,
        ease: 'Sine.easeInOut',
      });
    },
  };
}

function drawRoom3Floor(scene: Phaser.Scene): void {
  const floor = scene.add.graphics().setDepth(-12);
  floor.fillStyle(0x1e1a20);
  floor.fillRect(
    YIN_TIAN_ROOM3_START_X,
    211,
    YIN_TIAN_WORLD_WIDTH - YIN_TIAN_ROOM3_START_X,
    59,
  );
  for (let y = 214; y < 270; y += 5) {
    floor.fillStyle(y % 10 === 4 ? 0x312527 : 0x2a2025, 0.86);
    floor.fillRect(
      YIN_TIAN_ROOM3_START_X,
      y,
      YIN_TIAN_WORLD_WIDTH - YIN_TIAN_ROOM3_START_X,
      4,
    );
    floor.fillStyle(0x100e14, 0.44);
    floor.fillRect(
      YIN_TIAN_ROOM3_START_X,
      y + 4,
      YIN_TIAN_WORLD_WIDTH - YIN_TIAN_ROOM3_START_X,
      1,
    );
  }
  floor.fillStyle(0x791e2b, 0.1);
  floor.beginPath();
  floor.moveTo(1604, 229);
  floor.lineTo(1910, 215);
  floor.lineTo(1960, 270);
  floor.lineTo(1510, 270);
  floor.closePath();
  floor.fillPath();
}

function drawRoom3Window(scene: Phaser.Scene): void {
  const outside = scene.add.graphics().setDepth(-18);
  outside.fillStyle(0x121b2b);
  outside.fillRect(1648, 48, 224, 162);
  outside.fillStyle(0x16121b);
  outside.fillRect(1648, 54, 224, 128);
  outside.fillStyle(0x302024);
  outside.fillRect(1660, 88, 200, 96);
  for (let x = 1668; x < 1852; x += 26) {
    outside.fillStyle(0xe2a354, 0.62);
    outside.fillRect(x, 102, 12, 18);
    outside.fillStyle(0xf6c675, 0.36);
    outside.fillRect(x + 2, 105, 6, 9);
  }
  outside.fillStyle(0x1c252e);
  outside.fillRect(1648, 145, 224, 31);
  outside.fillStyle(0x58636a, 0.24);
  outside.fillRect(1648, 147, 224, 2);
  outside.fillStyle(0x161c25);
  outside.fillRect(1648, 173, 224, 25);
  outside.fillStyle(0x6f7476, 0.2);
  outside.fillRect(1648, 178, 224, 2);
  outside.fillStyle(0xd4b06d, 0.26);
  for (const x of [1670, 1705, 1788, 1822]) {
    outside.fillRect(x, 132, 3, 13);
    outside.fillStyle(0xe8c38a, 0.34);
    outside.fillRect(x - 2, 130, 7, 2);
    outside.fillStyle(0xd4b06d, 0.26);
  }
  outside.fillStyle(0x101725);
  outside.fillRect(1648, 183, 224, 17);
  outside.fillStyle(0x34141b, 0.62);
  outside.fillRect(1648, 196, 224, 9);

  const frame = scene.add.graphics().setDepth(-3);
  frame.fillStyle(0x0d141d);
  frame.fillRect(1632, 39, 256, 7);
  frame.fillRect(1632, 204, 256, 10);
  frame.fillRect(1632, 39, 9, 175);
  frame.fillRect(1879, 39, 9, 175);
  frame.fillStyle(0x283443);
  frame.fillRect(1638, 46, 3, 158);
  frame.fillRect(1876, 46, 3, 158);
  frame.fillStyle(0x39121c, 0.28);
  frame.fillRect(1648, 199, 224, 5);

  const butt = scene.add.graphics().setDepth(4);
  butt.fillStyle(0xb8afa1, 0.74);
  butt.fillRect(YIN_TIAN_BUTT_X, 201, 9, 2);
  butt.fillStyle(0x493b34);
  butt.fillRect(YIN_TIAN_BUTT_X + 7, 200, 3, 3);
  butt.fillStyle(0xd9d4c7, 0.32);
  butt.fillRect(YIN_TIAN_BUTT_X + 1, 201, 5, 1);
}

function createWindowFigure(
  scene: Phaser.Scene,
  x: number,
  y: number,
  facing: -1 | 1,
): Phaser.GameObjects.Graphics {
  const figure = scene.add.graphics().setPosition(x, y).setDepth(-1);
  if (facing === 1) {
    figure.fillStyle(0xffa17d, 0.42);
    figure.fillCircle(0, -28, 7);
    figure.fillTriangle(-10, -22, 10, -22, 6, -7);
    figure.fillTriangle(-6, -8, 6, -8, 8, 0);
    figure.fillStyle(0x222b35, 0.96);
    figure.fillCircle(0, -28, 5);
    figure.fillTriangle(-7, -22, 7, -22, 4, -8);
    figure.fillRect(-5, -8, 4, 8);
    figure.fillRect(1, -8, 4, 8);
    figure.fillRect(6, -21, 5, 2);
    figure.fillStyle(0xaab3b4, 0.32);
    figure.fillRect(-7, -22, 1, 13);
  } else {
    figure.fillStyle(0xffa17d, 0.42);
    figure.fillCircle(0, -29, 7);
    figure.fillTriangle(-8, -22, 8, -22, 4, -8);
    figure.fillTriangle(-10, -7, 10, -7, 12, 0);
    figure.fillStyle(0x4b303d, 0.96);
    figure.fillCircle(0, -29, 5);
    figure.fillRect(-6, -30, 12, 6);
    figure.fillRect(-7, -27, 3, 12);
    figure.fillTriangle(-6, -22, 6, -22, 3, -9);
    figure.fillTriangle(-8, -8, 8, -8, 10, 0);
    figure.fillStyle(0xffb7a0, 0.3);
    figure.fillRect(7, -22, 1, 14);
  }
  return figure;
}
