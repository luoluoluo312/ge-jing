import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

export class FlowerShop extends Phaser.GameObjects.Container {
  private readonly memoryGlow: Phaser.GameObjects.Graphics;
  private readonly livingFlowers: Phaser.GameObjects.Graphics;
  private readonly silhouettes: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    const shell = new Phaser.GameObjects.Graphics(scene);
    this.drawShell(shell);

    this.memoryGlow = new Phaser.GameObjects.Graphics(scene);
    this.drawMemoryGlow();
    this.livingFlowers = new Phaser.GameObjects.Graphics(scene);
    this.drawLivingFlowers();
    this.silhouettes = new Phaser.GameObjects.Graphics(scene);
    this.drawSilhouettes();

    const sign = new Phaser.GameObjects.Text(scene, 0, -96, '花 屋', {
      fontFamily: PIXEL_FONT_FAMILY,
      fontSize: '10px',
      color: '#d6b9b2',
      resolution: 1,
    }).setOrigin(0.5, 0);

    this.add([
      shell,
      this.memoryGlow,
      this.livingFlowers,
      this.silhouettes,
      sign,
    ]);
    this.memoryGlow.setAlpha(0);
    this.livingFlowers.setAlpha(0);
    this.silhouettes.setAlpha(0);
    this.setDepth(-1);
    scene.add.existing(this);
  }

  beginMemoryTransition(): void {
    this.memoryGlow.setVisible(true).setAlpha(0);
    this.livingFlowers.setVisible(true).setAlpha(0);
    this.silhouettes.setVisible(true).setAlpha(0);

    this.scene.tweens.add({
      targets: this.memoryGlow,
      alpha: 0.78,
      duration: 700,
      ease: 'Sine.easeOut',
    });
    this.scene.tweens.add({
      targets: this.livingFlowers,
      alpha: 1,
      delay: 300,
      duration: 1300,
      ease: 'Sine.easeInOut',
    });
    this.scene.tweens.add({
      targets: this.silhouettes,
      alpha: 0.7,
      delay: 900,
      duration: 900,
      ease: 'Sine.easeOut',
    });
  }

  settleMemory(): void {
    this.scene.tweens.killTweensOf([
      this.memoryGlow,
      this.livingFlowers,
      this.silhouettes,
    ]);
    this.memoryGlow.setAlpha(0.46);
    this.livingFlowers.setAlpha(1);
    this.scene.tweens.add({
      targets: this.silhouettes,
      alpha: 0,
      duration: 700,
      onComplete: () => this.silhouettes.setVisible(false),
    });
  }

  restoreCompletedState(): void {
    this.memoryGlow.setAlpha(0.46);
    this.livingFlowers.setAlpha(1);
    this.silhouettes.setAlpha(0).setVisible(false);
  }

  private drawShell(g: Phaser.GameObjects.Graphics): void {
    g.fillStyle(0x181428);
    g.fillRect(-88, -100, 176, 100);
    g.fillStyle(0x292038);
    g.fillRect(-94, -104, 188, 8);
    g.fillStyle(0x4c2939);
    g.fillRect(-82, -88, 164, 5);

    g.fillStyle(0x090e1b);
    g.fillRect(-65, -76, 91, 52);
    g.lineStyle(2, 0x4b3b55);
    g.strokeRect(-65, -76, 91, 52);
    g.fillStyle(0x20202f);
    g.fillRect(34, -72, 39, 72);
    g.fillStyle(0x5b4753);
    g.fillRect(42, -64, 22, 3);
    g.fillStyle(0x111728);
    g.fillRect(-93, -8, 186, 8);

    for (let x = -56; x <= 18; x += 10) {
      g.fillStyle(0x31313d);
      g.fillRect(x, -39, 2, 14);
      g.fillStyle(x % 20 === 4 ? 0x685066 : 0x4c4b52);
      g.fillRect(x - 2, -43, 6, 4);
      g.fillStyle(0x343642);
      g.fillRect(x - 3, -35, 8, 4);
    }

    g.fillStyle(0x1c1d2a);
    g.fillRect(-76, -19, 126, 9);
    g.fillStyle(0x31283b);
    g.fillRect(-85, -3, 170, 3);
  }

  private drawMemoryGlow(): void {
    const g = this.memoryGlow;
    g.fillStyle(0xf0b35f, 0.12);
    g.fillRect(-74, -86, 109, 68);
    g.fillStyle(0xffcd73, 0.18);
    g.fillRect(-62, -75, 88, 49);
    g.fillStyle(0xf5df9c, 0.16);
    g.fillRect(-53, -69, 70, 38);
    g.fillStyle(0xffdf91, 0.07);
    g.fillRect(-85, -110, 130, 26);
  }

  private drawLivingFlowers(): void {
    const g = this.livingFlowers;
    const flowerColors = [0xdc7f8d, 0xf0c36c, 0xc892b1, 0xe5a2a8];

    for (let index = 0; index < 9; index += 1) {
      const x = -52 + index * 9;
      const y = -35 - (index % 3) * 7;
      g.fillStyle(0x426748);
      g.fillRect(x, y + 5, 2, 12);
      g.fillStyle(flowerColors[index % flowerColors.length]);
      g.fillRect(x - 2, y, 6, 4);
      g.fillStyle(0xe5b77f);
      g.fillRect(x, y + 1, 2, 2);
    }

    g.fillStyle(0x9f6e52);
    g.fillRect(-58, -23, 76, 5);
    g.fillStyle(0xc78464);
    g.fillRect(-56, -24, 74, 2);
  }

  private drawSilhouettes(): void {
    const g = this.silhouettes;
    g.fillStyle(0x1b1824, 0.72);
    g.fillRect(-18, -49, 5, 4);
    g.fillRect(-20, -45, 9, 15);
    g.fillRect(-18, -30, 4, 8);
    g.fillRect(-8, -30, 4, 8);

    g.fillStyle(0x26202b, 0.62);
    g.fillRect(1, -46, 4, 4);
    g.fillRect(-1, -42, 8, 13);
    g.fillRect(1, -29, 3, 7);
    g.fillRect(5, -29, 3, 7);
  }
}
