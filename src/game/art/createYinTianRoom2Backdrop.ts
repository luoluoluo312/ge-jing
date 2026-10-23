import Phaser from 'phaser';

import {
  YIN_TIAN_ROOM2_END_X,
  YIN_TIAN_ROOM2_START_X,
} from './createYinTianBackdrop';

export const YIN_TIAN_MEMORY_X = 900;
export const YIN_TIAN_TIE_X = 700;
export const YIN_TIAN_HEELS_X = 1035;
export const YIN_TIAN_WINE_X = 1100;
export const YIN_TIAN_TORN_PHOTO_X = 820;

export type YinTianRoom2Environment = {
  update(delta: number): void;
  setVignetteActive(active: boolean): void;
  breakAndDim(): void;
};

export function createYinTianRoom2Backdrop(
  scene: Phaser.Scene,
): YinTianRoom2Environment {
  const wall = drawRoom2Wall(scene);
  const coolBase = scene.add
    .rectangle(
      (YIN_TIAN_ROOM2_START_X + YIN_TIAN_ROOM2_END_X) / 2,
      135,
      YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
      270,
      0x24213f,
    )
    .setDepth(-29);
  coolBase.setVisible(true);
  drawRoom2Floor(scene);
  drawPendantLamp(scene);
  drawThresholdDoor(scene);
  drawThirdDoor(scene);
  drawFloorObjects(scene);

  const warmFlash = scene.add
    .rectangle(
      (YIN_TIAN_ROOM2_START_X + YIN_TIAN_ROOM2_END_X) / 2,
      135,
      YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
      270,
      0xffb35f,
      1,
    )
    .setDepth(1)
    .setAlpha(0);
  const vignette = createVignette(scene);
  let elapsed = 0;
  let broken = false;

  return {
    update(delta: number): void {
      elapsed += delta;
      wall.setAlpha(
        broken ? 0.2 : 0.96 + Math.sin(elapsed / 920) * 0.02,
      );
    },
    setVignetteActive(active: boolean): void {
      vignette.setVisible(active);
    },
    breakAndDim(): void {
      if (broken) {
        return;
      }
      broken = true;
      scene.tweens.killTweensOf(warmFlash);
      scene.tweens.add({
        targets: warmFlash,
        alpha: 0.42,
        duration: 110,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.easeInOut',
      });
      scene.time.delayedCall(260, () => {
        scene.tweens.add({
          targets: wall,
          alpha: 0.2,
          duration: 160,
        });
      });
      scene.time.delayedCall(520, () => {
        scene.tweens.add({
          targets: warmFlash,
          alpha: 0.18,
          duration: 90,
          yoyo: true,
          repeat: 1,
        });
      });
    },
  };
}

function drawRoom2Wall(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const wall = scene.add.graphics().setDepth(-28);
  wall.fillStyle(0x4b352b);
  wall.fillRect(
    YIN_TIAN_ROOM2_START_X,
    0,
    YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
    216,
  );

  const wallpaperBands = [0x5b4032, 0x684936, 0x553b30, 0x73503b];
  for (let x = YIN_TIAN_ROOM2_START_X; x < YIN_TIAN_ROOM2_END_X; x += 68) {
    wall.fillStyle(wallpaperBands[Math.floor((x - 500) / 68) % wallpaperBands.length], 0.12);
    wall.fillRect(x, 0, 60, 216);
  }

  for (let index = 0; index < 86; index += 1) {
    const x = 512 + ((index * 43) % 750);
    const y = 12 + ((index * 29) % 190);
    wall.fillStyle(index % 3 === 0 ? 0xf0aa65 : 0x291a17, 0.13);
    wall.fillRect(x, y, 1 + (index % 3), 1 + ((index >> 2) % 2));
  }

  const peeled = [
    [510, 0, 24, 39],
    [520, 39, 11, 19],
    [1188, 151, 29, 26],
    [1178, 177, 14, 21],
    [864, 0, 18, 13],
  ] as const;
  for (const [x, y, width, height] of peeled) {
    wall.fillStyle(0x2a2321, 0.55);
    wall.fillRect(x, y, width, height);
    wall.fillStyle(0x8c6a50, 0.15);
    wall.fillRect(x + 3, y + height - 4, width - 6, 2);
  }

  const poster = scene.add.graphics().setDepth(-26);
  poster.fillStyle(0x231b1b);
  poster.fillRect(550, 62, 70, 92);
  poster.fillStyle(0xb19b7d);
  poster.fillRect(555, 67, 60, 82);
  poster.fillStyle(0x76604e, 0.5);
  poster.fillRect(565, 78, 40, 3);
  poster.fillRect(565, 87, 30, 2);
  poster.fillRect(565, 95, 43, 2);
  poster.fillStyle(0x63483b, 0.42);
  poster.fillRect(563, 113, 44, 27);
  poster.fillStyle(0x241b1b, 0.4);
  poster.fillRect(550, 139, 22, 15);
  poster.fillStyle(0xf1d7a1, 0.16);
  poster.fillRect(555, 68, 2, 77);

  wall.fillStyle(0xf0a15e, 0.06);
  wall.fillRect(610, 0, 250, 216);
  wall.fillStyle(0x16121b, 0.18);
  wall.fillRect(1040, 0, 240, 216);
  return wall;
}

function drawRoom2Floor(scene: Phaser.Scene): void {
  const floor = scene.add.graphics().setDepth(-11);
  floor.fillStyle(0x34231c);
  floor.fillRect(
    YIN_TIAN_ROOM2_START_X,
    211,
    YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
    59,
  );
  const planks = [0x493125, 0x52372a, 0x3f2b23, 0x5b3b2b];
  for (let y = 214; y < 270; y += 5) {
    floor.fillStyle(planks[Math.floor((y - 214) / 5) % planks.length], 0.78);
    floor.fillRect(
      YIN_TIAN_ROOM2_START_X,
      y,
      YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
      4,
    );
    floor.fillStyle(0x211713, 0.4);
    floor.fillRect(
      YIN_TIAN_ROOM2_START_X,
      y + 4,
      YIN_TIAN_ROOM2_END_X - YIN_TIAN_ROOM2_START_X,
      1,
    );
  }
  floor.fillStyle(0xf0a05d, 0.08);
  floor.fillRect(548, 218, 708, 3);
}

function drawPendantLamp(scene: Phaser.Scene): void {
  const glow = scene.add.graphics().setDepth(-25);
  glow.fillStyle(0xffc36e, 0.035);
  glow.fillCircle(900, 98, 92);
  glow.fillStyle(0xffc574, 0.07);
  glow.fillCircle(900, 98, 62);
  glow.fillStyle(0xffd78f, 0.12);
  glow.fillCircle(900, 98, 34);
  glow.fillStyle(0xffca73, 0.045);
  glow.beginPath();
  glow.moveTo(874, 74);
  glow.lineTo(926, 74);
  glow.lineTo(1018, 234);
  glow.lineTo(788, 234);
  glow.closePath();
  glow.fillPath();
  glow.fillStyle(0xffc469, 0.12);
  glow.fillEllipse(900, 238, 326, 52);
  glow.fillStyle(0xffdf9c, 0.1);
  glow.fillEllipse(900, 238, 218, 31);

  const fixture = scene.add.graphics().setDepth(-1);
  fixture.fillStyle(0x2b211d);
  fixture.fillRect(898, 0, 3, 48);
  fixture.fillStyle(0x5a4030);
  fixture.fillRect(878, 46, 44, 5);
  fixture.fillStyle(0x34261f);
  fixture.fillRect(872, 51, 56, 5);
  fixture.fillTriangle(872, 56, 928, 56, 912, 70);
  fixture.fillTriangle(872, 56, 888, 70, 872, 70);
  fixture.fillStyle(0x846044);
  fixture.fillRect(876, 53, 48, 2);
  fixture.fillStyle(0xffde94, 0.94);
  fixture.fillRect(896, 70, 8, 8);
  fixture.fillStyle(0xfff0be, 0.8);
  fixture.fillRect(898, 71, 4, 5);
}

function drawThresholdDoor(scene: Phaser.Scene): void {
  const door = scene.add.graphics().setDepth(-2);
  door.fillStyle(0x17191b);
  door.fillRect(466, 38, 58, 200);
  door.fillStyle(0x2f3438);
  door.fillRect(472, 44, 46, 194);
  door.fillStyle(0xd7c092, 0.28);
  door.fillRect(509, 48, 9, 188);
  door.fillStyle(0x1d1a19);
  door.fillRect(478, 48, 25, 188);
  door.fillStyle(0x8e5b38, 0.35);
  door.fillRect(503, 51, 5, 181);
  door.fillStyle(0x111416);
  door.fillRect(464, 34, 62, 8);
  door.fillRect(464, 228, 62, 10);
}

function drawThirdDoor(scene: Phaser.Scene): void {
  const door = scene.add.graphics().setDepth(-2);
  door.fillStyle(0x171214);
  door.fillRect(1188, 89, 72, 149);
  door.fillStyle(0x382720);
  door.fillRect(1195, 96, 58, 142);
  door.fillStyle(0x4f382b);
  door.fillRect(1201, 102, 46, 53);
  door.fillRect(1201, 160, 46, 72);
  door.fillStyle(0xb78454);
  door.fillRect(1238, 166, 3, 3);
  door.fillStyle(0x5f4433, 0.3);
  door.fillRect(1184, 232, 80, 6);
}

function drawFloorObjects(scene: Phaser.Scene): void {
  const spill = scene.add.graphics().setDepth(3);
  spill.fillStyle(0x481520, 0.78);
  spill.beginPath();
  spill.moveTo(865, 259);
  spill.lineTo(910, 255);
  spill.lineTo(950, 260);
  spill.lineTo(1006, 257);
  spill.lineTo(1088, 260);
  spill.lineTo(1094, 265);
  spill.lineTo(1002, 268);
  spill.lineTo(930, 266);
  spill.lineTo(890, 268);
  spill.lineTo(858, 264);
  spill.closePath();
  spill.fillPath();
  spill.fillStyle(0x6b202c, 0.58);
  spill.fillRect(872, 261, 28, 2);
  spill.fillRect(921, 257, 53, 3);
  spill.fillRect(1020, 262, 51, 2);
  spill.fillStyle(0x351018, 0.55);
  spill.fillRect(846, 264, 20, 2);

  const objects = scene.add.graphics().setDepth(4);
  objects.fillStyle(0x4c1d26);
  objects.fillRect(YIN_TIAN_TIE_X - 3, 241, 6, 4);
  objects.fillRect(YIN_TIAN_TIE_X - 2, 245, 4, 12);
  objects.fillStyle(0x7f3341, 0.8);
  objects.fillRect(YIN_TIAN_TIE_X - 1, 245, 2, 9);
  objects.fillStyle(0x1a1415);
  objects.fillRect(YIN_TIAN_HEELS_X - 9, 249, 11, 4);
  objects.fillRect(YIN_TIAN_HEELS_X - 7, 244, 4, 7);
  objects.fillRect(YIN_TIAN_HEELS_X + 5, 249, 11, 4);
  objects.fillRect(YIN_TIAN_HEELS_X + 8, 244, 4, 7);
  objects.fillStyle(0x8f4d43, 0.45);
  objects.fillRect(YIN_TIAN_HEELS_X - 8, 249, 7, 1);
  objects.fillRect(YIN_TIAN_HEELS_X + 6, 249, 8, 1);

  objects.fillStyle(0xbfc3c0, 0.76);
  objects.fillRect(1080, 247, 15, 6);
  objects.fillRect(1094, 249, 12, 2);
  objects.fillRect(1104, 245, 3, 9);
  objects.fillRect(1100, 251, 10, 2);
  objects.fillStyle(0xf0ece0, 0.45);
  objects.fillRect(1083, 248, 8, 1);

  objects.fillStyle(0x2a2220);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X - 23, 248, 18, 15);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X, 250, 17, 14);
  objects.fillStyle(0xc5b8a3);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X - 20, 250, 12, 11);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X + 3, 252, 11, 10);
  objects.fillStyle(0x8e7462);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X - 19, 252, 3, 2);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X - 12, 253, 2, 2);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X + 5, 254, 3, 2);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X + 10, 255, 2, 2);
  objects.fillStyle(0x5a3d33);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X - 12, 254, 2, 1);
  objects.fillRect(YIN_TIAN_TORN_PHOTO_X + 12, 256, 2, 1);
}

function createVignette(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const vignette = scene.add
    .graphics()
    .setScrollFactor(0)
    .setDepth(18)
    .setVisible(false);
  for (let index = 0; index < 18; index += 1) {
    const alpha = 0.012 + (18 - index) * 0.004;
    vignette.fillStyle(0x100906, alpha);
    vignette.fillRect(index, 0, 1, 270);
    vignette.fillRect(479 - index, 0, 1, 270);
    vignette.fillRect(0, index, 480, 1);
    vignette.fillRect(0, 269 - index, 480, 1);
  }
  return vignette;
}
