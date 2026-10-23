import Phaser from 'phaser';

import {
  createControlHint,
  createFujiFarLandscape,
  drawLampGroundReflection,
  drawStreetLamp,
} from '../art/createFujiBackdrop';
import { Traveler } from '../entities/Traveler';
import { InteractionSystem } from '../systems/InteractionSystem';
import { DialogueBox } from '../ui/DialogueBox';
import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const WORLD_WIDTH = 1400;
const GROUND_Y = 238;
const PLAYER_START_X = 240;
const PLAYER_SPEED = 76;
const PLAYER_MARGIN = 16;
const ENTRY_X = 540;
const YIN_TIAN_DOOR_X = 930;

type ControlKeys = {
  leftA: Phaser.Input.Keyboard.Key;
  rightD: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
  interact: Phaser.Input.Keyboard.Key;
  pause: Phaser.Input.Keyboard.Key;
};

export class HubScene extends Phaser.Scene {
  private traveler!: Traveler;
  private interactions!: InteractionSystem;
  private dialogue!: DialogueBox;
  private pauseOverlay!: Phaser.GameObjects.Container;
  private fujiSign!: Phaser.GameObjects.Container;
  private yinTianSign!: Phaser.GameObjects.Container;
  private entrancePromptOpen = false;
  private paused = false;
  private keys!: ControlKeys;

  constructor() {
    super('HubScene');
  }

  create(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is unavailable.');
    }

    keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.E,
      Phaser.Input.Keyboard.KeyCodes.ESC,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    ]);

    this.keys = keyboard.addKeys({
      leftA: Phaser.Input.Keyboard.KeyCodes.A,
      rightD: Phaser.Input.Keyboard.KeyCodes.D,
      leftArrow: Phaser.Input.Keyboard.KeyCodes.LEFT,
      rightArrow: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as ControlKeys;

    this.createWorld();

    this.traveler = new Traveler(this, PLAYER_START_X, GROUND_Y);
    this.interactions = new InteractionSystem(this, this.traveler);
    this.interactions.addTarget({
      x: ENTRY_X,
      y: GROUND_Y,
      range: 42,
      label: '富士山入口',
      onInteract: () => this.openEntrancePrompt(),
    });
    this.interactions.addTarget({
      id: 'yintian-door',
      x: YIN_TIAN_DOOR_X,
      y: GROUND_Y,
      range: 42,
      label: '推门',
      onInteract: () => this.enterYinTianWorld(),
    });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    camera.startFollow(this.traveler, true, 0.12, 0.12);

    this.createFixedUi();
    this.dialogue = new DialogueBox(this);
    this.createPauseOverlay();

    this.events.on(Phaser.Scenes.Events.WAKE, this.handleWake, this);
  }

  update(time: number, delta: number): void {
    if (this.entrancePromptOpen) {
      this.traveler.stop();

      if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
        this.closeEntrancePrompt();
      } else if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
        this.enterSongWorld();
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      this.setPaused(!this.paused);
    }

    if (this.paused) {
      this.traveler.stop();
      return;
    }

    const moveLeft = this.keys.leftA.isDown || this.keys.leftArrow.isDown;
    const moveRight = this.keys.rightD.isDown || this.keys.rightArrow.isDown;
    const direction = moveLeft === moveRight ? 0 : moveLeft ? -1 : 1;

    this.traveler.x = Phaser.Math.Clamp(
      this.traveler.x + direction * PLAYER_SPEED * (delta / 1000),
      PLAYER_MARGIN,
      WORLD_WIDTH - PLAYER_MARGIN,
    );
    this.traveler.updateMotion(direction, delta);
    this.updateWorldSigns(time);
    this.interactions.update();
  }

  private createWorld(): void {
    createFujiFarLandscape(this, {
      skyWidth: 1200,
      cityWidth: 1800,
    });

    const foreground = this.add.graphics().setDepth(0);
    foreground.fillStyle(0x0b1b31);
    foreground.fillRect(0, 205, WORLD_WIDTH, GROUND_Y - 205);
    foreground.fillStyle(0x233653);
    foreground.fillRect(0, GROUND_Y - 3, WORLD_WIDTH, 3);
    foreground.fillStyle(0x111f35);
    foreground.fillRect(0, GROUND_Y, WORLD_WIDTH, GAME_HEIGHT - GROUND_Y);

    for (const lampX of [100, 470, 1050, 1250]) {
      drawStreetLamp(this, lampX);
      drawLampGroundReflection(foreground, lampX);
    }

    foreground.fillStyle(0x74383b);
    foreground.fillRect(ENTRY_X - 30, GROUND_Y - 64, 5, 64);
    foreground.fillRect(ENTRY_X + 25, GROUND_Y - 64, 5, 64);
    foreground.fillRect(ENTRY_X - 40, GROUND_Y - 68, 80, 5);
    foreground.fillRect(ENTRY_X - 32, GROUND_Y - 55, 64, 4);

    foreground.fillStyle(0x0b0e12);
    foreground.fillRect(YIN_TIAN_DOOR_X - 36, GROUND_Y - 93, 72, 93);
    foreground.fillStyle(0x1f2429);
    foreground.fillRect(YIN_TIAN_DOOR_X - 31, GROUND_Y - 88, 62, 88);
    foreground.fillStyle(0x11161b);
    foreground.fillRect(YIN_TIAN_DOOR_X - 27, GROUND_Y - 84, 54, 84);
    foreground.fillStyle(0x2c3137);
    foreground.fillRect(YIN_TIAN_DOOR_X - 24, GROUND_Y - 82, 34, 82);
    foreground.fillStyle(0x454b50);
    foreground.fillRect(YIN_TIAN_DOOR_X - 20, GROUND_Y - 78, 24, 26);
    foreground.fillRect(YIN_TIAN_DOOR_X - 20, GROUND_Y - 45, 24, 35);
    foreground.fillStyle(0xffb95f, 0.26);
    foreground.fillRect(YIN_TIAN_DOOR_X + 8, GROUND_Y - 82, 19, 82);
    foreground.fillStyle(0xffd083, 0.72);
    foreground.fillRect(YIN_TIAN_DOOR_X + 12, GROUND_Y - 80, 10, 78);
    foreground.fillStyle(0xffedbd, 0.72);
    foreground.fillRect(YIN_TIAN_DOOR_X + 15, GROUND_Y - 76, 3, 72);
    foreground.fillStyle(0xb9a16f);
    foreground.fillRect(YIN_TIAN_DOOR_X + 4, GROUND_Y - 42, 3, 3);

    foreground.fillStyle(0xd6a355, 0.08);
    foreground.beginPath();
    foreground.moveTo(ENTRY_X - 24, GROUND_Y - 1);
    foreground.lineTo(ENTRY_X + 24, GROUND_Y - 1);
    foreground.lineTo(ENTRY_X + 88, GROUND_Y + 22);
    foreground.lineTo(ENTRY_X - 88, GROUND_Y + 22);
    foreground.closePath();
    foreground.fillPath();
    foreground.fillStyle(0xd6a355, 0.12);
    foreground.fillRect(ENTRY_X - 54, GROUND_Y + 4, 108, 5);

    foreground.fillStyle(0xffc46d, 0.11);
    foreground.beginPath();
    foreground.moveTo(YIN_TIAN_DOOR_X - 30, GROUND_Y - 1);
    foreground.lineTo(YIN_TIAN_DOOR_X + 30, GROUND_Y - 1);
    foreground.lineTo(YIN_TIAN_DOOR_X + 102, GROUND_Y + 24);
    foreground.lineTo(YIN_TIAN_DOOR_X - 102, GROUND_Y + 24);
    foreground.closePath();
    foreground.fillPath();
    foreground.fillStyle(0xffce7d, 0.2);
    foreground.fillRect(YIN_TIAN_DOOR_X - 68, GROUND_Y + 5, 136, 4);

    this.fujiSign = this.createWorldSign(
      ENTRY_X,
      GROUND_Y - 96,
      '富士山下',
      0xd8b47e,
    );
    this.yinTianSign = this.createWorldSign(
      YIN_TIAN_DOOR_X,
      GROUND_Y - 104,
      '阴天',
      0xcbd8dc,
    );
  }

  private createWorldSign(
    x: number,
    y: number,
    label: string,
    accent: number,
  ): Phaser.GameObjects.Container {
    const board = this.add.graphics();
    board.fillStyle(0x100b09);
    board.fillRect(-33, -12, 66, 24);
    board.fillStyle(0x4a3020);
    board.fillRect(-30, -10, 60, 20);
    board.fillStyle(0x68452e);
    board.fillRect(-27, -8, 54, 3);
    board.fillRect(-27, 7, 54, 2);
    board.fillStyle(0x2c1b14, 0.7);
    board.fillRect(-24, -3, 48, 1);
    board.fillStyle(accent, 0.26);
    board.fillRect(-27, -7, 2, 15);

    const text = this.add
      .text(0, 0, label, {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#e5dfd3',
        resolution: 1,
      })
      .setOrigin(0.5);
    return this.add
      .container(x, y, [board, text])
      .setDepth(3)
      .setAlpha(0.82);
  }

  private updateWorldSigns(time: number): void {
    const pulse = 0.82 + (Math.sin(time / 190) * 0.5 + 0.5) * 0.14;
    this.fujiSign.setAlpha(
      Math.abs(this.traveler.x - ENTRY_X) <= 80 ? pulse : 0.82,
    );
    this.yinTianSign.setAlpha(
      Math.abs(this.traveler.x - YIN_TIAN_DOOR_X) <= 80 ? pulse : 0.82,
    );
  }

  private createFixedUi(): void {
    createControlHint(this, '互动');
  }

  private createPauseOverlay(): void {
    const shade = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x020611,
      0.72,
    );
    const title = this.add
      .text(GAME_WIDTH / 2, 122, '已暂停', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '20px',
        color: '#edf3ff',
        resolution: 1,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(GAME_WIDTH / 2, 148, '按 Esc 继续', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#9fb4d8',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.pauseOverlay = this.add
      .container(0, 0, [shade, title, hint])
      .setScrollFactor(0)
      .setDepth(90)
      .setVisible(false);
  }

  private openEntrancePrompt(): void {
    this.entrancePromptOpen = true;
    this.interactions.setEnabled(false);
    this.traveler.stop();
    this.input.keyboard?.resetKeys();
    this.dialogue.show(
      '富士山下',
      '',
      'E 进入    Esc 返回',
    );
  }

  private closeEntrancePrompt(): void {
    this.entrancePromptOpen = false;
    this.dialogue.hide();
    this.interactions.setEnabled(true);
    this.input.keyboard?.resetKeys();
  }

  private enterSongWorld(): void {
    this.dialogue.hide();
    this.entrancePromptOpen = false;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    if (
      this.scene.isSleeping('FujiScene') ||
      this.scene.isActive('FujiScene')
    ) {
      this.scene.stop('FujiScene');
    }

    this.registry.set('completedStoryEvents', []);
    this.registry.set('seenNarrations', []);
    this.scene.launch('FujiScene');
    this.scene.sleep();
  }

  private enterYinTianWorld(): void {
    this.interactions.setEnabled(false);
    this.traveler.stop();
    this.input.keyboard?.resetKeys();
    for (const sceneKey of ['YinTianTitleScene', 'YinTianScene']) {
      if (
        this.scene.isSleeping(sceneKey) ||
        this.scene.isActive(sceneKey)
      ) {
        this.scene.stop(sceneKey);
      }
    }

    this.registry.set('completedStoryEvents', []);
    this.registry.set('seenNarrations', []);
    this.scene.launch('YinTianTitleScene');
    this.scene.sleep();
  }

  private handleWake(): void {
    this.entrancePromptOpen = false;
    this.paused = false;
    this.pauseOverlay.setVisible(false);
    this.dialogue.hide();
    this.traveler.stop();
    this.interactions.setEnabled(true);
    this.input.keyboard?.resetKeys();
  }

  private setPaused(paused: boolean): void {
    this.paused = paused;
    this.pauseOverlay.setVisible(paused);
    this.interactions.setEnabled(!paused);
    this.traveler.stop();
    this.input.keyboard?.resetKeys();
  }
}
