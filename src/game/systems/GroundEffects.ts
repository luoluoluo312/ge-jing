import Phaser from 'phaser';

type Splash = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

type Footprint = {
  x: number;
  y: number;
  life: number;
  side: -1 | 1;
};

export class GroundEffects {
  private readonly fixed: Phaser.GameObjects.Graphics;
  private readonly dynamic: Phaser.GameObjects.Graphics;
  private readonly puddles = [270, 316, 452];
  private readonly puddleCooldowns = [0, 0, 0];
  private readonly splashes: Splash[] = [];
  private readonly footprints: Footprint[] = [];
  private lastFootprintX = Number.NEGATIVE_INFINITY;
  private footSide: -1 | 1 = 1;

  constructor(scene: Phaser.Scene, groundY: number) {
    this.fixed = scene.add.graphics().setDepth(1);
    this.dynamic = scene.add.graphics().setDepth(6);

    for (const x of this.puddles) {
      this.fixed.fillStyle(0x5f8596, 0.22);
      this.fixed.fillRect(x - 13, groundY - 3, 27, 4);
      this.fixed.fillStyle(0x91b4bf, 0.16);
      this.fixed.fillRect(x - 7, groundY - 4, 15, 2);
    }
  }

  update(
    delta: number,
    playerX: number,
    groundY: number,
    mode: 'rain' | 'snow' | 'none',
    moving: boolean,
  ): void {
    this.dynamic.clear();

    for (let index = 0; index < this.puddleCooldowns.length; index += 1) {
      this.puddleCooldowns[index] = Math.max(
        0,
        this.puddleCooldowns[index] - delta,
      );
    }

    if (mode === 'rain' && moving) {
      for (let index = 0; index < this.puddles.length; index += 1) {
        if (
          Math.abs(playerX - this.puddles[index]) < 8 &&
          this.puddleCooldowns[index] <= 0
        ) {
          this.spawnSplash(this.puddles[index], groundY - 2);
          this.puddleCooldowns[index] = 520;
        }
      }
    }

    if (mode === 'snow' && moving && Math.abs(playerX - this.lastFootprintX) > 25) {
      this.footprints.push({
        x: playerX,
        y: groundY + 2,
        life: 2600,
        side: this.footSide,
      });
      this.lastFootprintX = playerX;
      this.footSide = this.footSide === 1 ? -1 : 1;
    }

    this.updateSplashes(delta);
    this.updateFootprints(delta);
  }

  private spawnSplash(x: number, y: number): void {
    for (let index = 0; index < 5; index += 1) {
      this.splashes.push({
        x,
        y,
        vx: (index - 2) * 7,
        vy: -14 - (index % 3) * 5,
        life: 420,
      });
    }
  }

  private updateSplashes(delta: number): void {
    for (let index = this.splashes.length - 1; index >= 0; index -= 1) {
      const splash = this.splashes[index];
      splash.life -= delta;
      if (splash.life <= 0) {
        this.splashes.splice(index, 1);
        continue;
      }

      splash.vy += 48 * (delta / 1000);
      splash.x += splash.vx * (delta / 1000);
      splash.y += splash.vy * (delta / 1000);
      this.dynamic.fillStyle(0xcce2eb, splash.life / 420);
      this.dynamic.fillRect(
        Math.round(splash.x),
        Math.round(splash.y),
        splash.vx < 0 ? 1 : 2,
        2,
      );
    }
  }

  private updateFootprints(delta: number): void {
    for (let index = this.footprints.length - 1; index >= 0; index -= 1) {
      const footprint = this.footprints[index];
      footprint.life -= delta;
      if (footprint.life <= 0) {
        this.footprints.splice(index, 1);
        continue;
      }

      this.dynamic.fillStyle(0x566b70, footprint.life / 4400);
      this.dynamic.fillRect(
        Math.round(footprint.x + footprint.side * 2),
        Math.round(footprint.y),
        4,
        2,
      );
      this.dynamic.fillStyle(0x71858a, footprint.life / 5200);
      this.dynamic.fillRect(
        Math.round(footprint.x - 1),
        Math.round(footprint.y + 3),
        3,
        2,
      );
    }
  }
}
