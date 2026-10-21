import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

export class YinTianTitleScene extends Phaser.Scene {
  constructor() {
    super('YinTianTitleScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#000000');
    this.registry.set('completedStoryEvents', []);
    this.registry.set('seenNarrations', []);

    this.add
      .text(240, 108, '歌境 · 阴天', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '20px',
        color: '#f2f2ef',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.add
      .text(240, 143, '《阴天》· 莫文蔚', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#a9afb3',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.add
      .text(240, 160, '请自行在外部播放', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '8px',
        color: '#7f878c',
        resolution: 1,
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(240, 192, '按任意键进入房间', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#d8d9d5',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.38,
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    this.input.keyboard?.once('keydown', () => {
      this.scene.start('YinTianScene');
    });
  }
}
