import Phaser from 'phaser';

export class Car extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;
  private readonly reflection: Phaser.GameObjects.Graphics;
  private reflectionTween?: Phaser.Tweens.Tween;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.art = new Phaser.GameObjects.Graphics(scene);
    this.reflection = new Phaser.GameObjects.Graphics(scene);
    this.add([this.art, this.reflection]);

    this.drawCar();
    this.drawReflection();
    this.reflection.setVisible(false);
    this.setDepth(5);
    scene.add.existing(this);
  }

  showWindowReflection(): void {
    this.reflectionTween?.stop();
    this.reflection.setAlpha(0).setVisible(true);
    this.reflectionTween = this.scene.tweens.add({
      targets: this.reflection,
      alpha: 1,
      duration: 420,
    });
  }

  hideWindowReflection(): void {
    this.reflectionTween?.stop();
    this.reflectionTween = this.scene.tweens.add({
      targets: this.reflection,
      alpha: 0,
      duration: 420,
      onComplete: () => this.reflection.setVisible(false),
    });
  }

  private drawCar(): void {
    const g = this.art;
    g.fillStyle(0x050914, 0.75);
    g.fillEllipse(0, 0, 132, 10);

    g.fillStyle(0x0b101b);
    g.fillRect(-64, -15, 128, 10);
    g.fillStyle(0x171c2a);
    g.fillRect(-58, -34, 114, 22);
    g.fillStyle(0x202637);
    g.fillRect(-48, -48, 74, 17);
    g.fillStyle(0x2e3548);
    g.fillRect(-39, -45, 54, 10);

    g.fillStyle(0xf1b759);
    g.fillRect(-34, -43, 24, 8);
    g.fillStyle(0xe89b45);
    g.fillRect(1, -43, 19, 8);
    g.fillStyle(0x090d16);
    g.fillRect(-8, -44, 4, 10);
    g.fillStyle(0x553921);
    g.fillRect(-33, -35, 22, 2);
    g.fillRect(2, -35, 17, 2);

    g.fillStyle(0x080d17);
    g.fillRect(-52, -27, 96, 4);
    g.fillRect(-53, -15, 100, 2);
    g.fillStyle(0x3f4659);
    g.fillRect(-47, -25, 84, 2);
    g.fillStyle(0x0a0f19);
    g.fillRect(14, -32, 2, 17);
    g.fillStyle(0xaeb2b6);
    g.fillRect(18, -29, 8, 2);
    g.fillRect(-35, -29, 8, 2);
    g.fillStyle(0x642329);
    g.fillRect(53, -29, 8, 5);
    g.fillStyle(0xf05c4d);
    g.fillRect(57, -30, 5, 3);
    g.fillStyle(0xf4cf86);
    g.fillRect(-60, -27, 4, 4);

    this.drawWheel(-38, -10);
    this.drawWheel(36, -10);

    g.fillStyle(0xb6d1e6, 0.16);
    g.fillRect(-54, -14, 108, 2);
    g.fillStyle(0xeaa84e, 0.2);
    g.fillRect(-31, -9, 20, 2);
  }

  private drawWheel(x: number, y: number): void {
    const g = this.art;
    g.fillStyle(0x070b12);
    g.fillRect(x - 8, y - 8, 16, 16);
    g.fillStyle(0x151b27);
    g.fillRect(x - 6, y - 6, 12, 12);
    g.fillStyle(0x718298);
    g.fillRect(x - 3, y - 3, 6, 6);
    g.fillStyle(0x202a3a);
    g.fillRect(x - 1, y - 1, 2, 2);
  }

  private drawReflection(): void {
    const g = this.reflection;

    g.fillStyle(0xf0c77a, 0.16);
    g.fillRect(1, -43, 20, 10);

    g.fillStyle(0xe1b070, 0.7);
    g.fillRect(5, -42, 5, 4);
    g.fillRect(3, -38, 9, 6);
    g.fillStyle(0x9d7755, 0.58);
    g.fillRect(2, -32, 11, 11);

    g.fillStyle(0xdbe8f2, 0.74);
    g.fillRect(11, -41, 4, 3);
    g.fillRect(10, -38, 6, 5);
    g.fillStyle(0xaec7d8, 0.58);
    g.fillRect(9, -33, 8, 10);

    g.fillStyle(0xf6dca8, 0.8);
    g.fillRect(3, -43, 2, 1);
    g.fillRect(18, -40, 2, 1);
    g.fillRect(7, -31, 1, 1);
  }
}
