import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from './pixelFont';

const PHONE_X = 344;
const PHONE_Y = 104;
const BANNER_X = 406;
const BANNER_Y = 50;

export class PhoneUI extends Phaser.GameObjects.Container {
  private readonly incomingPhone: Phaser.GameObjects.Container;
  private readonly incomingScreenText: Phaser.GameObjects.Text;
  private readonly answerButton: Phaser.GameObjects.Rectangle;
  private readonly answerText: Phaser.GameObjects.Text;
  private readonly messageBanner: Phaser.GameObjects.Container;
  private readonly messageText: Phaser.GameObjects.Text;
  private accepted = false;

  constructor(
    scene: Phaser.Scene,
    private readonly onAccepted: () => void,
  ) {
    super(scene, 0, 0);

    const avatar = createFemaleAvatar(scene, 0, -33);
    const shadow = scene.add.rectangle(0, 3, 78, 134, 0x02040a, 0.7);
    const body = scene.add.rectangle(0, 0, 76, 132, 0x0d1220);
    const screen = scene.add.rectangle(0, -4, 66, 104, 0x182e45);
    const speaker = scene.add.rectangle(0, -59, 24, 3, 0x405166);
    const statusTime = scene.add
      .text(-26, -50, '23:00', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '7px',
        color: '#dce8ee',
        resolution: 1,
      })
      .setOrigin(0, 0.5);
    const battery = createBatteryIcon(scene, 20, -50);
    const screenText = scene.add
      .text(0, -8, '来电\n旧友', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#e3e9ef',
        align: 'center',
        lineSpacing: 4,
        resolution: 1,
      })
      .setOrigin(0.5);
    const answerButton = scene.add
      .rectangle(0, 35, 54, 23, 0x31553f)
      .setStrokeStyle(1, 0x9fba9e);
    const answerText = scene.add
      .text(0, 35, '接听', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#edf3e8',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.incomingPhone = scene.add
      .container(PHONE_X, PHONE_Y, [
        shadow,
        body,
        screen,
        speaker,
        statusTime,
        battery,
        avatar,
        screenText,
        answerButton,
        answerText,
      ])
      .setVisible(false);

    const bannerAvatar = createFemaleAvatar(scene, -48, 0);
    const bannerBackground = scene.add
      .rectangle(4, 0, 132, 56, 0x071225, 0.96)
      .setStrokeStyle(1, 0x7087a7);
    const bannerAccent = scene.add.rectangle(-60, 0, 4, 56, 0x9fb4d8, 0.7);
    const messageLabel = scene.add
      .text(-32, -18, '新消息', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '7px',
        color: '#e2c890',
        resolution: 1,
      })
      .setOrigin(0, 0.5);
    const messageText = scene.add
      .text(-32, -7, '', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '9px',
        color: '#e7eef8',
        lineSpacing: 2,
        resolution: 1,
        wordWrap: { width: 82, useAdvancedWrap: true },
      })
      .setOrigin(0, 0);

    this.messageBanner = scene.add
      .container(BANNER_X, BANNER_Y, [
        bannerBackground,
        bannerAccent,
        bannerAvatar,
        messageLabel,
        messageText,
      ])
      .setVisible(false);

    this.incomingScreenText = screenText;
    this.answerButton = answerButton;
    this.answerText = answerText;
    this.messageText = messageText;
    this.add([this.incomingPhone, this.messageBanner]);
    this.setScrollFactor(0);
    this.setDepth(85);
    this.setVisible(false);
    scene.add.existing(this);

    this.setInteractive(
      new Phaser.Geom.Rectangle(
        PHONE_X - 27,
        PHONE_Y + 24,
        54,
        23,
      ),
      Phaser.Geom.Rectangle.Contains,
    );
    this.on('pointerup', () => {
      if (!this.visible || !this.incomingPhone.visible || this.accepted) {
        return;
      }
      this.accepted = true;
      this.onAccepted();
    });
  }

  showIncoming(): void {
    this.scene.tweens.killTweensOf(this);
    this.scene.tweens.killTweensOf(this.incomingPhone);
    this.scene.tweens.killTweensOf(this.messageBanner);
    this.scene.tweens.killTweensOf(this.messageText);
    this.incomingScreenText.setText('来电\n旧友');
    this.answerButton
      .setVisible(true)
      .setAlpha(1);
    this.answerText.setVisible(true).setAlpha(1);
    this.incomingPhone
      .setPosition(PHONE_X, PHONE_Y)
      .setVisible(true)
      .setAlpha(1);
    this.messageBanner.setVisible(false).setAlpha(0);
    this.messageText.setAlpha(0);
    this.accepted = false;
    this.setVisible(true).setAlpha(1);
  }

  showMessage(message: string): void {
    this.answerButton.setVisible(false);
    this.answerText.setVisible(false);
    this.messageBanner
      .setPosition(BANNER_X, BANNER_Y + 16)
      .setVisible(true)
      .setAlpha(0);
    this.messageText.setText(message).setAlpha(0);

    this.scene.tweens.add({
      targets: this.incomingPhone,
      y: PHONE_Y - 32,
      alpha: 0,
      duration: 220,
      ease: 'Sine.easeIn',
      onComplete: () => this.incomingPhone.setVisible(false),
    });
    this.scene.tweens.add({
      targets: this.messageBanner,
      y: BANNER_Y,
      alpha: 1,
      duration: 320,
      ease: 'Sine.easeOut',
    });
    this.scene.time.delayedCall(180, () => {
      this.scene.tweens.add({
        targets: this.messageText,
        alpha: 1,
        duration: 420,
      });
    });
  }

  hide(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 220,
      onComplete: () => this.setVisible(false),
    });
  }
}

function createFemaleAvatar(
  scene: Phaser.Scene,
  x: number,
  y: number,
): Phaser.GameObjects.Graphics {
  const avatar = scene.add.graphics().setPosition(x, y);
  avatar.fillStyle(0x0d1728, 0.65);
  avatar.fillRect(-14, -14, 28, 28);
  avatar.fillStyle(0x7e5b5d);
  avatar.fillRect(-10, -10, 20, 17);
  avatar.fillStyle(0xd9b992);
  avatar.fillRect(-7, -7, 14, 12);
  avatar.fillStyle(0x392a28);
  avatar.fillRect(-9, -11, 18, 5);
  avatar.fillRect(-10, -7, 4, 15);
  avatar.fillRect(6, -7, 4, 11);
  avatar.fillStyle(0x45322f);
  avatar.fillRect(-5, -3, 2, 2);
  avatar.fillRect(4, -3, 2, 2);
  avatar.fillStyle(0xb56f72);
  avatar.fillRect(-1, 2, 3, 1);
  avatar.fillStyle(0xb89d89);
  avatar.fillRect(-9, 8, 18, 6);
  return avatar;
}

function createBatteryIcon(
  scene: Phaser.Scene,
  x: number,
  y: number,
): Phaser.GameObjects.Graphics {
  const battery = scene.add.graphics().setPosition(x, y);
  battery.lineStyle(1, 0xdce8ee, 0.9);
  battery.strokeRect(-6, -3, 11, 6);
  battery.fillStyle(0xdce8ee, 0.9);
  battery.fillRect(5, -1, 2, 2);
  battery.fillRect(-4, -1, 6, 2);
  return battery;
}
