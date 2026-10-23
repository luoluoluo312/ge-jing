import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

type InteractionTarget = {
  id?: string;
  x: number;
  y: number;
  range: number;
  label: string;
  name?: string;
  nameRange?: number;
  nameOffsetY?: number;
  interactive?: boolean;
  enabled?: boolean;
  onInteract: () => void;
};

export class InteractionSystem {
  private readonly prompt: Phaser.GameObjects.Text;
  private readonly nameLabel: Phaser.GameObjects.Text;
  private readonly interactKey: Phaser.Input.Keyboard.Key;
  private readonly targets: InteractionTarget[] = [];
  private activeTarget: InteractionTarget | null = null;
  private namedTargetId: string | null = null;
  private enabled = true;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Phaser.GameObjects.Container,
  ) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is unavailable.');
    }

    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.prompt = scene.add
      .text(0, 0, '', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#f2d6a2',
        backgroundColor: '#0a1526cc',
        padding: { x: 4, y: 2 },
        resolution: 1,
      })
      .setOrigin(0.5, 1)
      .setPosition(240, 258)
      .setScrollFactor(0)
      .setDepth(20)
      .setVisible(false);

    this.nameLabel = scene.add
      .text(0, 0, '', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#d7d0c2',
        backgroundColor: '#071225b8',
        padding: { x: 3, y: 2 },
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
      .setOrigin(0.5, 1)
      .setDepth(20)
      .setAlpha(0)
      .setVisible(false);
  }

  addTarget(target: InteractionTarget): void {
    this.targets.push({ enabled: true, ...target });
  }

  setTargetEnabled(id: string, enabled: boolean): void {
    const target = this.targets.find((candidate) => candidate.id === id);
    if (target) {
      target.enabled = enabled;
    }
  }

  setTargetInteractive(id: string, interactive: boolean): void {
    const target = this.targets.find((candidate) => candidate.id === id);
    if (target) {
      target.interactive = interactive;
    }
  }

  setTargetLabel(id: string, label: string): void {
    const target = this.targets.find((candidate) => candidate.id === id);
    if (target) {
      target.label = label;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.activeTarget = null;
      this.prompt.setVisible(false);
      this.setNamedTarget(null);
    }
  }

  update(): void {
    if (!this.enabled) {
      return;
    }

    const nearbyTargets = this.targets
      .filter((target) => target.enabled !== false)
      .map((target) => ({
        target,
        distance: Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          target.x,
          target.y,
        ),
      }));

    this.activeTarget =
      nearbyTargets
        .filter(
          ({ target, distance }) =>
            target.interactive !== false && distance <= target.range,
        )
        .sort((a, b) => a.distance - b.distance)[0]?.target ?? null;

    const namedTarget =
      nearbyTargets
        .filter(
          ({ target, distance }) =>
            target.enabled !== false &&
            Boolean(target.name) &&
            distance <= (target.nameRange ?? target.range),
        )
        .sort((a, b) => a.distance - b.distance)[0]?.target ?? null;
    this.setNamedTarget(namedTarget);

    if (!this.activeTarget) {
      this.prompt.setVisible(false);
      return;
    }

    this.prompt
      .setText(`E  ${this.activeTarget.label}`)
      .setVisible(true);

    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.activeTarget.onInteract();
    }
  }

  private setNamedTarget(target: InteractionTarget | null): void {
    const targetId = target?.id ?? null;
    if (targetId === this.namedTargetId) {
      return;
    }

    this.namedTargetId = targetId;
    this.scene.tweens.killTweensOf(this.nameLabel);

    if (!target?.name) {
      this.scene.tweens.add({
        targets: this.nameLabel,
        alpha: 0,
        duration: 160,
        onComplete: () => this.nameLabel.setVisible(false),
      });
      return;
    }

    this.nameLabel
      .setText(target.name)
      .setPosition(target.x, target.y - (target.nameOffsetY ?? 52))
      .setAlpha(0)
      .setVisible(true);
    this.scene.tweens.add({
      targets: this.nameLabel,
      alpha: 1,
      duration: 220,
    });
  }
}
