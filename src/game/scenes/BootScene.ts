import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    this.load.image('couple-source', 'assets/images/couple.png');
  }

  create(): void {
    this.scene.start('TitleScene');
  }
}
