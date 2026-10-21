import Phaser from 'phaser';

export class MemorialStone extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;
  private carried = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.art = new Phaser.GameObjects.Graphics(scene);
    this.add(this.art);
    this.setDepth(6);
    this.draw();
    scene.add.existing(this);
  }

  setCarried(carried: boolean): void {
    this.carried = carried;
    this.draw();
  }

  followPlayer(x: number, y: number): void {
    if (this.carried) {
      this.setPosition(x + 7, y - 16);
    }
  }

  returnToGround(x: number, y: number): void {
    this.setPosition(x, y);
  }

  private draw(): void {
    this.art.clear();
    if (this.carried) {
      this.art.fillStyle(0x424850);
      this.art.fillRect(-3, -3, 6, 5);
      this.art.fillStyle(0x7f8991);
      this.art.fillRect(-2, -3, 3, 2);
      return;
    }

    this.art.fillStyle(0x303740);
    this.art.fillRect(-9, -8, 18, 8);
    this.art.fillRect(-6, -11, 12, 4);
    this.art.fillStyle(0x5f6872);
    this.art.fillRect(-6, -9, 8, 4);
    this.art.fillRect(2, -6, 5, 3);
    this.art.fillStyle(0x8b959b);
    this.art.fillRect(-4, -9, 4, 2);
  }
}
