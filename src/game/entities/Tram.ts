import Phaser from 'phaser';

export class Tram extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, y: number) {
    super(scene, -300, y);
    this.art = new Phaser.GameObjects.Graphics(scene);
    this.add(this.art);
    this.draw();
    this.setDepth(2);
    this.setVisible(false);
    scene.add.existing(this);
  }

  pass(camera: Phaser.Cameras.Scene2D.Camera, fromX: number, toX: number): void {
    this.setPosition(fromX, this.y).setVisible(true);
    this.scene.time.delayedCall(3000, () => camera.shake(180, 0.0018));
    this.scene.tweens.add({
      targets: this,
      x: toX,
      duration: 6400,
      ease: 'Sine.easeInOut',
      onComplete: () => this.setVisible(false),
    });
  }

  private draw(): void {
    const g = this.art;
    g.fillStyle(0x071017);
    g.fillRect(-78, -52, 156, 46);
    g.fillStyle(0x285445);
    g.fillRect(-74, -48, 148, 37);
    g.fillStyle(0xd7c49a);
    g.fillRect(-72, -28, 146, 4);
    g.fillStyle(0x19362f);
    g.fillRect(-62, -43, 27, 11);
    g.fillRect(-28, -43, 27, 11);
    g.fillRect(6, -43, 27, 11);
    g.fillRect(40, -43, 27, 11);
    g.fillStyle(0xf3bb66);
    g.fillRect(-60, -41, 23, 7);
    g.fillRect(-26, -41, 23, 7);
    g.fillRect(8, -41, 23, 7);
    g.fillRect(42, -41, 23, 7);
    g.fillStyle(0x7e2833);
    g.fillRect(-76, -22, 150, 3);
    g.fillStyle(0x101a22);
    g.fillRect(-57, -8, 16, 8);
    g.fillRect(38, -8, 16, 8);
    g.fillStyle(0x93a7b5);
    g.fillRect(-52, -5, 6, 5);
    g.fillRect(43, -5, 6, 5);
    g.fillStyle(0xe7dfcb);
    g.fillRect(60, -46, 11, 8);
    g.fillStyle(0xf1c66f);
    g.fillRect(72, -38, 3, 3);
  }
}
