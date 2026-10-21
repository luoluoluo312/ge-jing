import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.registry.set('completedStoryEvents', []);
    this.registry.set('seenNarrations', []);

    this.add
      .text(240, 112, '歌境', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '20px',
        color: '#f0ece4',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.add
      .text(240, 143, '请自行在外部播放《富士山下》', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#a7a39c',
        resolution: 1,
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(240, 184, '按任意键开始', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#d9c7a4',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.35,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.once('keydown', () => {
      this.scene.start('HubScene');
    });
  }
}
