import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from './pixelFont';

const BOX_WIDTH = 240;
const BOX_HEIGHT = 82;

export class DialogueBox extends Phaser.GameObjects.Container {
  private readonly titleText: Phaser.GameObjects.Text;
  private readonly bodyText: Phaser.GameObjects.Text;
  private readonly footerText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const background = scene.add.graphics();
    background.fillStyle(0x071225, 0.94);
    background.fillRect(-BOX_WIDTH / 2, -BOX_HEIGHT / 2, BOX_WIDTH, BOX_HEIGHT);
    background.lineStyle(1, 0x9caecc, 0.9);
    background.strokeRect(
      -BOX_WIDTH / 2 + 2,
      -BOX_HEIGHT / 2 + 2,
      BOX_WIDTH - 4,
      BOX_HEIGHT - 4,
    );

    const titleText = scene.add.text(-BOX_WIDTH / 2 + 10, -BOX_HEIGHT / 2 + 8, '', {
      fontFamily: PIXEL_FONT_FAMILY,
      fontSize: '10px',
      color: '#f2d6a2',
      resolution: 1,
    });
    const bodyText = scene.add.text(
      -BOX_WIDTH / 2 + 10,
      -BOX_HEIGHT / 2 + 25,
      '',
      {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#e6edf9',
        lineSpacing: 4,
        resolution: 1,
        wordWrap: { width: BOX_WIDTH - 20, useAdvancedWrap: true },
      },
    );
    const footerText = scene.add.text(
      BOX_WIDTH / 2 - 10,
      BOX_HEIGHT / 2 - 9,
      '',
      {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#9fb4d8',
        resolution: 1,
      },
    );
    footerText.setOrigin(1, 1);

    super(scene, 240, 135, [background, titleText, bodyText, footerText]);
    this.titleText = titleText;
    this.bodyText = bodyText;
    this.footerText = footerText;

    this.setScrollFactor(0);
    this.setDepth(100);
    this.setVisible(false);
    scene.add.existing(this);
  }

  show(title: string, body: string, footer: string): void {
    this.titleText.setText(title);
    this.bodyText.setText(body);
    this.footerText.setText(footer);
    this.setVisible(true);
  }

  hide(): void {
    this.setVisible(false);
  }
}
