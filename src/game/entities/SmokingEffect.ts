import Phaser from 'phaser';

export class SmokingEffect extends Phaser.GameObjects.Graphics {
  private elapsed = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene);
    this.setPosition(x, y);
    this.setDepth(9);
    this.setVisible(false);
  }

  start(): void {
    this.elapsed = 0;
    this.setVisible(true);
  }

  update(delta: number): void {
    if (!this.visible) {
      return;
    }

    this.elapsed += delta;
    this.clear();

    const glow = Math.floor(this.elapsed / 220) % 2 === 0;
    this.fillStyle(glow ? 0xffa05c : 0xb6402f, 0.95);
    this.fillRect(18, -31, 2, 2);
    this.fillStyle(glow ? 0x6d3c29 : 0x452d24, 0.5);
    this.fillRect(19, -34, 2, 2);

    for (let index = 0; index < 4; index += 1) {
      const cycle = (this.elapsed * 0.05 + index * 31) % 92;
      const rise = 4 + cycle * 0.45;
      const drift = Math.sin((this.elapsed + index * 470) * 0.003) * (4 + cycle * 0.08);
      const alpha = Math.max(0, 0.32 - cycle / 330);
      this.fillStyle(index % 2 === 0 ? 0xaab0b5 : 0x7f8b96, alpha);
      this.fillRect(
        Math.round(17 + drift),
        Math.round(-36 - rise),
        index % 2 === 0 ? 4 : 3,
        3,
      );
      if (cycle > 48) {
        this.fillRect(
          Math.round(14 + drift),
          Math.round(-39 - rise),
          2,
          2,
        );
      }
    }
  }
}
