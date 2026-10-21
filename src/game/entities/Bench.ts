import Phaser from 'phaser';

export class Bench extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.art = new Phaser.GameObjects.Graphics(scene);
    this.add(this.art);
    this.setDepth(4);
    this.draw();
    scene.add.existing(this);
  }

  private draw(): void {
    const g = this.art;
    g.fillStyle(0x2d2426);
    g.fillRect(-37, -30, 74, 6);
    g.fillRect(-35, -23, 70, 5);
    g.fillStyle(0x68483b);
    g.fillRect(-36, -29, 72, 4);
    g.fillRect(-34, -22, 68, 3);
    g.fillStyle(0x3b3031);
    g.fillRect(-30, -17, 5, 17);
    g.fillRect(25, -17, 5, 17);
    g.fillRect(-39, -31, 5, 14);
    g.fillRect(34, -31, 5, 14);
    g.fillStyle(0x8b6550);
    g.fillRect(-34, -18, 68, 4);
    g.fillStyle(0x1e2029);
    g.fillRect(-37, -2, 74, 2);
  }
}
