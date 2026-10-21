import Phaser from 'phaser';

export class YinTianMemoryFigures extends Phaser.GameObjects.Container {
  private readonly male: Phaser.GameObjects.Container;
  private readonly female: Phaser.GameObjects.Container;
  private readonly glow: Phaser.GameObjects.Graphics;
  private readonly sceneRef: Phaser.Scene;
  private separated = false;
  private dissolved = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.sceneRef = scene;
    this.glow = scene.add.graphics();
    this.glow.fillStyle(0xf4cd8f, 0.08);
    this.glow.fillCircle(0, -20, 32);
    this.glow.fillStyle(0xffd99a, 0.12);
    this.glow.fillCircle(0, -19, 20);

    this.male = this.createMale();
    this.female = this.createFemale();
    this.male.setPosition(-8, 0).setAngle(4);
    this.female.setPosition(9, 0).setScale(-1, 1).setAngle(-4);
    this.add([this.glow, this.male, this.female]);
    this.setDepth(4);
    scene.add.existing(this);
  }

  separateBackToBack(): void {
    if (this.separated || this.dissolved) {
      return;
    }
    this.separated = true;
    this.sceneRef.tweens.add({
      targets: this.male,
      x: -20,
      scaleX: -1,
      angle: -4,
      duration: 1450,
      ease: 'Sine.easeInOut',
    });
    this.sceneRef.tweens.add({
      targets: this.female,
      x: 20,
      scaleX: 1,
      angle: 4,
      duration: 1450,
      ease: 'Sine.easeInOut',
    });
  }

  stepApartAndDissolve(): void {
    if (this.dissolved) {
      return;
    }
    this.dissolved = true;
    this.sceneRef.tweens.add({
      targets: this.male,
      x: -30,
      duration: 380,
      ease: 'Sine.easeOut',
    });
    this.sceneRef.tweens.add({
      targets: this.female,
      x: 30,
      duration: 380,
      ease: 'Sine.easeOut',
    });
    this.sceneRef.time.delayedCall(360, () => {
      this.sceneRef.tweens.add({
        targets: [this.male, this.female, this.glow],
        alpha: 0,
        duration: 600,
        ease: 'Sine.easeIn',
      });
      this.createDust();
    });
  }

  private createDust(): void {
    const originX = this.x;
    const originY = this.y;
    for (let index = 0; index < 38; index += 1) {
      const x = originX - 33 + ((index * 19) % 68);
      const y = originY - 44 + ((index * 17) % 44);
      const size = 1 + (index % 3);
      const particle = this.sceneRef.add
        .rectangle(x, y, size, size, 0xd9c5aa, 0.5)
        .setDepth(5);
      this.sceneRef.tweens.add({
        targets: particle,
        x: x + (index % 2 === 0 ? -4 : 4),
        y: y - 20 - (index % 5) * 5,
        alpha: 0,
        duration: 850 + (index % 4) * 120,
        delay: (index % 6) * 55,
        ease: 'Sine.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  private createMale(): Phaser.GameObjects.Container {
    const figure = this.sceneRef.add.container(0, 0);
    const art = this.sceneRef.add.graphics();
    art.fillStyle(0xd9cfbe, 0.42);
    art.fillRect(-6, -33, 12, 6);
    art.fillRect(-8, -27, 16, 17);
    art.fillStyle(0xe8ddca, 0.58);
    art.fillRect(-5, -26, 10, 14);
    art.fillStyle(0xafa79d, 0.45);
    art.fillRect(-7, -10, 6, 10);
    art.fillRect(1, -10, 6, 10);
    art.fillStyle(0xf1e4cf, 0.48);
    art.fillRect(-7, -27, 3, 14);
    art.fillRect(5, -26, 3, 11);
    art.fillStyle(0xf2dcc8, 0.62);
    art.fillRect(-5, -38, 10, 7);
    art.fillStyle(0xc3a993, 0.5);
    art.fillRect(-6, -41, 12, 4);
    art.fillStyle(0xffffff, 0.28);
    art.fillRect(-2, -31, 2, 7);
    figure.add(art);
    return figure;
  }

  private createFemale(): Phaser.GameObjects.Container {
    const figure = this.sceneRef.add.container(0, 0);
    const art = this.sceneRef.add.graphics();
    art.fillStyle(0xa67468, 0.44);
    art.fillRect(-6, -41, 12, 11);
    art.fillRect(-8, -35, 4, 13);
    art.fillRect(4, -35, 4, 10);
    art.fillStyle(0xf0d7c5, 0.56);
    art.fillRect(-5, -38, 10, 7);
    art.fillStyle(0xe8d5c6, 0.5);
    art.fillRect(-7, -29, 14, 18);
    art.fillStyle(0xd2b7aa, 0.54);
    art.fillRect(-9, -12, 18, 8);
    art.fillStyle(0xf8ead8, 0.3);
    art.fillRect(1, -28, 5, 13);
    art.fillStyle(0xd1b29c, 0.5);
    art.fillRect(-6, -4, 5, 5);
    art.fillRect(2, -4, 5, 5);
    figure.add(art);
    return figure;
  }
}
