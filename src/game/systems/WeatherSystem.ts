import Phaser from 'phaser';

export type WeatherMode = 'rain' | 'seasonal';

type Particle = {
  x: number;
  y: number;
  speed: number;
  length: number;
  phase: number;
};

export class WeatherSystem {
  private readonly graphics: Phaser.GameObjects.Graphics;
  private readonly particles: Particle[] = [];
  private elapsed = 0;
  private opacity = 1;
  private freezeRemainingMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly worldWidth: number,
  ) {
    this.graphics = scene.add.graphics().setScrollFactor(1.08).setDepth(80);

    for (let index = 0; index < 130; index += 1) {
      this.particles.push({
        x: Phaser.Math.Between(0, 720),
        y: Phaser.Math.Between(0, 270),
        speed: Phaser.Math.Between(25, 56),
        length: Phaser.Math.Between(2, 6),
        phase: Phaser.Math.FloatBetween(0, Math.PI * 2),
      });
    }
  }

  setOpacity(alpha: number): void {
    this.opacity = Phaser.Math.Clamp(alpha, 0, 1);
  }

  freeze(durationMs: number): void {
    this.freezeRemainingMs = Math.max(this.freezeRemainingMs, durationMs);
  }

  update(
    delta: number,
    mode: WeatherMode,
    seasonProgress = 0,
  ): void {
    if (this.freezeRemainingMs > 0) {
      this.freezeRemainingMs -= delta;
      return;
    }

    this.elapsed += delta;
    this.graphics.clear().setAlpha(this.opacity);

    if (mode === 'rain') {
      this.updateRain(delta);
    } else {
      this.updateSeasonalParticles(delta, seasonProgress);
    }
  }

  private updateRain(delta: number): void {
    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      particle.y += particle.speed * 4.2 * (delta / 1000);
      particle.x -= particle.speed * 0.75 * (delta / 1000);
      this.wrapParticle(particle);

      this.graphics.lineStyle(
        index % 9 === 0 ? 2 : 1,
        index % 7 === 0 ? 0xf2f6ff : 0xaec8e2,
        index % 9 === 0 ? 0.8 : 0.5,
      );
      this.graphics.lineBetween(
        Math.round(particle.x),
        Math.round(particle.y),
        Math.round(particle.x - 1),
        Math.round(particle.y + particle.length),
      );
    }
  }

  private updateSeasonalParticles(delta: number, seasonProgress: number): void {
    const progress = Phaser.Math.Clamp(seasonProgress, 0, 1);
    const speedScale = 0.92 - progress * 0.38;
    const red = Math.round(232 + (246 - 232) * progress);
    const green = Math.round(240 + (150 - 240) * progress);
    const blue = Math.round(247 + (185 - 247) * progress);
    const color = (red << 16) | (green << 8) | blue;

    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      particle.y += particle.speed * speedScale * (delta / 1000);
      const curve =
        Math.sin(this.elapsed * 0.0018 + particle.phase) *
        (1.2 + progress * 9);
      particle.x += curve * (delta / 1000);

      if (particle.y >= 244) {
        this.resetParticleNearCamera(particle);
        continue;
      }
      if (
        particle.x < this.scene.cameras.main.scrollX - 100 ||
        particle.x > this.scene.cameras.main.scrollX + 580
      ) {
        particle.x = Phaser.Math.Between(
          this.scene.cameras.main.scrollX - 60,
          this.scene.cameras.main.scrollX + 520,
        );
      }

      const x = Math.round(particle.x);
      const y = Math.round(particle.y);
      this.graphics.fillStyle(color, index % 4 === 0 ? 0.58 : 0.42);
      this.graphics.fillRect(
        x,
        y,
        progress > 0.62 ? 3 : 2,
        progress > 0.62 ? 3 : 2,
      );
      if (progress > 0.5 && index % 3 === 0) {
        this.graphics.fillRect(x + 2, y + 1, 1, 1);
      }
    }
  }

  private wrapParticle(particle: Particle): void {
    const cameraLeft = this.scene.cameras.main.scrollX;
    const cameraRight = cameraLeft + 720;
    if (
      particle.y <= 270 &&
      particle.x >= cameraLeft - 100 &&
      particle.x <= cameraRight + 100
    ) {
      return;
    }

    if (particle.y > 270) {
      particle.y = Phaser.Math.Between(-18, -2);
    }
    particle.x = Phaser.Math.Between(cameraLeft - 60, cameraRight + 40);
  }

  private resetParticleNearCamera(particle: Particle): void {
    const cameraLeft = this.scene.cameras.main.scrollX;
    particle.y = Phaser.Math.Between(-20, -2);
    particle.x = Phaser.Math.Between(cameraLeft - 60, cameraLeft + 520);
  }
}
