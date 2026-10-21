import Phaser from 'phaser';

type Facing = -1 | 1;

export class Traveler extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;
  private facing: Facing = 1;
  private walkElapsed = 0;
  private sitting = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.art = new Phaser.GameObjects.Graphics(scene);
    this.add(this.art);
    this.setDepth(5);
    this.redraw(false, 0);
    scene.add.existing(this);
  }

  updateMotion(direction: -1 | 0 | 1, delta: number): void {
    const moving = direction !== 0;

    if (moving) {
      this.facing = direction;
      this.walkElapsed += delta;
    } else {
      this.walkElapsed = 0;
    }

    const frame = moving ? Math.floor(this.walkElapsed / 110) % 4 : 0;
    this.setScale(this.facing, 1);
    this.redraw(moving, frame);
  }

  stop(): void {
    this.walkElapsed = 0;
    this.redraw(false, 0);
  }

  setSitting(sitting: boolean): void {
    this.sitting = sitting;
    this.redraw(false, 0);
  }

  private redraw(moving: boolean, frame: number): void {
    const bob = moving && (frame === 1 || frame === 3) ? -1 : 0;
    const leftLeg = moving && (frame === 1 || frame === 2) ? -1 : 0;
    const rightLeg = moving && (frame === 2 || frame === 3) ? 1 : 0;

    this.art.clear();

    this.art.fillStyle(0x050b16, 0.55);
    this.art.fillRect(-8, -1, 16, 3);

    if (this.sitting) {
      this.art.fillStyle(0x201c20);
      this.art.fillRect(-8, -21, 4, 11);
      this.art.fillStyle(0x5b4030);
      this.art.fillRect(-9, -19, 3, 8);
      this.art.fillStyle(0x9b7654);
      this.art.fillRect(-6, -22, 11, 14);
      this.art.fillStyle(0x6e4f39);
      this.art.fillRect(-5, -11, 10, 3);
      this.art.fillStyle(0xc7a17c);
      this.art.fillRect(-4, -28, 8, 6);
      this.art.fillStyle(0x181a27);
      this.art.fillRect(-6, -30, 12, 4);
      this.art.fillStyle(0x303e5a);
      this.art.fillRect(-4, -9, 12, 4);
      this.art.fillRect(-3, -5, 4, 6);
      this.art.fillRect(5, -5, 4, 6);
      return;
    }

    this.art.fillStyle(0x201c20);
    this.art.fillRect(-8, -25 + bob, 4, 12);
    this.art.fillStyle(0x5b4030);
    this.art.fillRect(-9, -23 + bob, 3, 9);
    this.art.fillStyle(0x9b7654);
    this.art.fillRect(-6, -25 + bob, 11, 15);
    this.art.fillRect(-5, -26 + bob, 9, 2);
    this.art.fillStyle(0x6e4f39);
    this.art.fillRect(-5, -13 + bob, 10, 3);
    this.art.fillRect(-1, -25 + bob, 2, 12);
    this.art.fillStyle(0xc7a17c);
    this.art.fillRect(-4, -31 + bob, 8, 6);
    this.art.fillStyle(0x181a27);
    this.art.fillRect(-6, -33 + bob, 12, 4);
    this.art.fillRect(-6, -30 + bob, 3, 5);
    this.art.fillRect(-5, -29 + bob, 2, 2);
    this.art.fillStyle(0x303e5a);
    this.art.fillRect(-5 + leftLeg, -9, 4, 8);
    this.art.fillRect(1 + rightLeg, -9, 4, 8);
    this.art.fillStyle(0x111827);
    this.art.fillRect(-6 + leftLeg, -2, 5, 2);
    this.art.fillRect(1 + rightLeg, -2, 5, 2);
  }
}
