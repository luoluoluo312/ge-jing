import Phaser from 'phaser';

import { drawFujiMountain, drawStreetLamp } from './createFujiBackdrop';

export const ACT4_START_X = 3500;
export const ACT4_END_X = 4700;
export const ACT5_START_X = 4700;
export const ACT5_END_X = 6500;
export const MEMORIAL_STONE_X = 4240;
export const ACT5_CAR_X = 4870;
export const ACT5_COUPLE_X = 5130;
export const BENCH_X = 6000;

export type Act5Environment = {
  update(morningProgress: number, active: boolean): void;
};

export function createAct4Backdrop(scene: Phaser.Scene): void {
  const ground = scene.add.graphics().setDepth(-8);

  ground.fillStyle(0xcbd8dd);
  ground.fillRect(ACT4_START_X, 205, 1200, 65);
  ground.fillStyle(0xe4ebed);
  ground.fillRect(ACT4_START_X, 209, 1120, 6);
  ground.fillStyle(0xaebfc5);
  ground.fillRect(ACT4_START_X, 235, 1200, 4);
  ground.fillStyle(0x9e3136, 0.08);
  ground.fillRect(ACT4_START_X, 239, 1200, 28);

  for (const x of [3600, 3880, 4160, 4490, 4660]) {
    ground.fillStyle(0x394c52);
    ground.fillRect(x, 165, 5, 54);
    ground.fillRect(x - 18, 176, 22, 3);
    ground.fillRect(x + 4, 183, 18, 3);
    ground.fillRect(x - 7, 193, 13, 3);
    ground.fillStyle(0xdce5e5);
    ground.fillRect(x - 19, 174, 21, 3);
    ground.fillRect(x + 2, 181, 20, 2);
    ground.fillRect(x - 8, 191, 9, 2);
  }

  for (let x = 3540; x < ACT4_END_X; x += 118) {
    ground.fillStyle(0xb6c7cb);
    ground.fillRect(x, 248, 66 + ((x / 118) % 3) * 9, 2);
  }
}

export function createAct5Backdrop(scene: Phaser.Scene): Act5Environment {
  scene.add
    .rectangle(240, 135, 700, 380, 0x08172b)
    .setScrollFactor(0)
    .setDepth(-45);

  const facade = scene.add.graphics().setDepth(-4);
  facade.fillStyle(0x141827);
  for (let x = ACT5_START_X + 20; x < ACT5_END_X; x += 96) {
    const height = 37 + ((x / 96) % 4) * 11;
    const top = 205 - height;
    facade.fillRect(x, top, 74, height);
    facade.fillStyle(0x232b3a);
    facade.fillRect(x + 6, top + 8, 61, 2);
    facade.fillRect(x + 6, top + 24, 61, 2);
    facade.fillStyle(0x0a0e17);
    facade.fillRect(x + 10, top + 13, 13, 7);
    facade.fillRect(x + 32, top + 13, 13, 7);
    facade.fillRect(x + 54, top + 13, 10, 7);
    facade.fillStyle(((x / 96) % 3) === 0 ? 0xc99052 : 0x617a85);
    facade.fillRect(x + 14, top + 15, 3, 2);
    facade.fillRect(x + 38, top + 29, 3, 2);
    facade.fillRect(x + 12, 180, 2, 2);
    facade.fillRect(x + 49, 191, 2, 2);
    facade.fillStyle(0x141827);
  }
  facade.fillStyle(0x252638);
  facade.fillRect(ACT5_START_X, 169, 1800, 4);

  const wetStreet = scene.add.graphics().setDepth(-9);
  wetStreet.fillStyle(0x253044, 0.7);
  wetStreet.fillRect(ACT5_START_X, 237, 1800, 2);
  for (const x of [4770, 5270, 5790, 6320]) {
    drawStreetLamp(scene, x);
  }
  wetStreet.fillStyle(0xe4b367, 0.08);
  wetStreet.fillRect(4740, 241, 620, 18);

  const finalMountain = scene.add
    .graphics()
    .setScrollFactor(0.08)
    .setDepth(-35)
    .setPosition(410, 0)
    .setAlpha(0.92)
    .setVisible(false);
  drawFujiMountain(finalMountain);

  const dawn = scene.add.graphics().setScrollFactor(0).setDepth(-37);
  dawn.fillStyle(0x405b7d, 1);
  dawn.fillRect(0, 0, 480, 80);
  dawn.fillStyle(0x8d7395, 1);
  dawn.fillRect(0, 80, 480, 48);
  dawn.fillStyle(0xe6a487, 1);
  dawn.fillRect(0, 128, 480, 35);
  dawn.fillStyle(0xffd69a, 1);
  dawn.fillRect(0, 163, 480, 42);
  dawn.setAlpha(0);

  const sun = scene.add.graphics().setScrollFactor(0).setDepth(-36);
  drawPixelSun(sun, 72, 58);
  sun.setAlpha(0);

  return {
    update(morningProgress: number, active: boolean): void {
      finalMountain.setVisible(active);
      dawn.setAlpha(
        Phaser.Math.Clamp(morningProgress, 0, 1) * 0.72,
      );
      sun.setAlpha(Phaser.Math.Clamp(morningProgress, 0, 1));
    },
  };
}

function drawPixelSun(
  graphics: Phaser.GameObjects.Graphics,
  centerX: number,
  centerY: number,
): void {
  const fillDisc = (radius: number, color: number, alpha: number): void => {
    graphics.fillStyle(color, alpha);
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      const width = Math.floor(
        2 * Math.sqrt(radius * radius - offsetY * offsetY),
      );
      if (width > 0) {
        graphics.fillRect(
          centerX - Math.floor(width / 2),
          centerY + offsetY,
          width,
          1,
        );
      }
    }
  };

  fillDisc(18, 0xffc873, 0.1);
  fillDisc(12, 0xffd888, 0.28);
  fillDisc(9, 0xffe5a7, 0.96);
  fillDisc(6, 0xfff3cc, 0.9);
}
