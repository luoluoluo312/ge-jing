import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

export class NarrationSystem {
  private readonly text: Phaser.GameObjects.Text;
  private hideTimer?: Phaser.Time.TimerEvent;

  constructor(private readonly scene: Phaser.Scene) {
    this.text = scene.add
      .text(240, 45, '', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#d8d2c7',
        align: 'center',
        lineSpacing: 3,
        resolution: 1,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#020713',
          blur: 0,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(75)
      .setAlpha(0)
      .setVisible(false);
  }

  playOnce(id: string, message: string, y = 45, scale = 1): void {
    const seen = this.scene.registry.get('seenNarrations') as string[] | undefined;
    const seenIds = new Set(seen ?? []);
    if (seenIds.has(id)) {
      return;
    }

    seenIds.add(id);
    this.scene.registry.set('seenNarrations', [...seenIds]);
    this.show(message, 3000, y, scale);
  }

  show(message: string, durationMs = 3000, y = 45, scale = 1): void {
    this.hideTimer?.remove(false);
    this.scene.tweens.killTweensOf(this.text);
    this.text
      .setPosition(240, y)
      .setScale(scale)
      .setText(message)
      .setVisible(true)
      .setAlpha(0);
    this.scene.tweens.add({
      targets: this.text,
      alpha: 0.9,
      duration: 420,
    });
    this.hideTimer = this.scene.time.delayedCall(durationMs, () => {
      this.scene.tweens.add({
        targets: this.text,
        alpha: 0,
        duration: 380,
        onComplete: () => this.text.setVisible(false),
      });
    });
  }
}
