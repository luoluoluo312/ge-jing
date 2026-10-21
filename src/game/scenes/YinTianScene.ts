import Phaser from 'phaser';

import {
  createYinTianBackdrop,
  YIN_TIAN_CIGARETTE_X,
  YIN_TIAN_GROUND_Y,
  YIN_TIAN_PHOTO_X,
  YIN_TIAN_PHOTO_Y,
  YIN_TIAN_PLAYER_END_X,
  YIN_TIAN_PLAYER_START_X,
  YIN_TIAN_ROOM2_END_X,
  YIN_TIAN_ROOM2_START_X,
  YIN_TIAN_ROOM3_START_X,
  YIN_TIAN_WORLD_WIDTH,
  type YinTianEnvironment,
} from '../art/createYinTianBackdrop';
import { createYinTianPhotoTexture } from '../art/createYinTianPhoto';
import {
  createYinTianRoom2Backdrop,
  YIN_TIAN_HEELS_X,
  YIN_TIAN_MEMORY_X,
  YIN_TIAN_TIE_X,
  YIN_TIAN_TORN_PHOTO_X,
  YIN_TIAN_WINE_X,
  type YinTianRoom2Environment,
} from '../art/createYinTianRoom2Backdrop';
import {
  createYinTianRoom3Backdrop,
  YIN_TIAN_BUTT_X,
  YIN_TIAN_WINDOW_CENTER_X,
  YIN_TIAN_WINDOW_CENTER_Y,
  type YinTianRoom3Environment,
} from '../art/createYinTianRoom3Backdrop';
import { YIN_TIAN_EVENTS } from '../data/yinTianEvents';
import type { StoryEvent } from '../data/storyEvent';
import { Traveler } from '../entities/Traveler';
import { YinTianMemoryFigures } from '../entities/YinTianMemoryFigures';
import { InteractionSystem } from '../systems/InteractionSystem';
import { NarrationSystem } from '../systems/NarrationSystem';
import { StoryDirector } from '../systems/StoryDirector';
import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const PLAYER_SPEED = 72;
const PLAYER_LEFT_LIMIT = 28;
const CIGARETTE_TIP_X = 112;
const CIGARETTE_TIP_Y = 199;

type ControlKeys = {
  leftA: Phaser.Input.Keyboard.Key;
  rightD: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
  pause: Phaser.Input.Keyboard.Key;
};

export class YinTianScene extends Phaser.Scene {
  private traveler!: Traveler;
  private memoryFigures!: YinTianMemoryFigures;
  private interactions!: InteractionSystem;
  private narration!: NarrationSystem;
  private storyDirector!: StoryDirector;
  private environment!: YinTianEnvironment;
  private room2Environment!: YinTianRoom2Environment;
  private room3Environment!: YinTianRoom3Environment;
  private pauseOverlay!: Phaser.GameObjects.Container;
  private cigaretteGlow!: Phaser.GameObjects.Graphics;
  private cigaretteFx!: Phaser.GameObjects.Graphics;
  private photoSmall!: Phaser.GameObjects.Container;
  private photoOverlay!: Phaser.GameObjects.Container;
  private photoDim!: Phaser.GameObjects.Rectangle;
  private windowReflection!: Traveler;
  private objectHighlight!: Phaser.GameObjects.Graphics;
  private chapterTitle!: Phaser.GameObjects.Text;
  private rainWash!: Phaser.GameObjects.Rectangle;
  private rainStreaks!: Phaser.GameObjects.Graphics;
  private finalExitPrompt!: Phaser.GameObjects.Text;
  private keys!: ControlKeys;
  private paused = false;
  private inputLocked = false;
  private cameraFollowing = false;
  private room2TransitionPlayed = false;
  private room2ChapterShown = false;
  private room3ChapterShown = false;
  private endingAwaitingExit = false;
  private room3ExitHandled = false;
  private room3Event?: StoryEvent;
  private cigaretteElapsed = 0;
  private cigaretteActive = false;

  constructor() {
    super('YinTianScene');
  }

  create(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input is unavailable.');
    }

    this.paused = false;
    this.inputLocked = false;
    this.cameraFollowing = false;
    this.room2TransitionPlayed = false;
    this.room2ChapterShown = false;
    this.room3ChapterShown = false;
    this.endingAwaitingExit = false;
    this.room3ExitHandled = false;
    this.room3Event = undefined;
    this.cigaretteElapsed = 0;
    this.cigaretteActive = false;

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
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as ControlKeys;

    this.environment = createYinTianBackdrop(this);
    this.room2Environment = createYinTianRoom2Backdrop(this);
    this.room3Environment = createYinTianRoom3Backdrop(this);
    this.memoryFigures = new YinTianMemoryFigures(
      this,
      YIN_TIAN_MEMORY_X,
      YIN_TIAN_GROUND_Y,
    );
    this.windowReflection = new Traveler(
      this,
      YIN_TIAN_WINDOW_CENTER_X - 56,
      207,
    );
    this.windowReflection
      .setDepth(2)
      .setScale(-0.82, 0.82)
      .setAlpha(0)
      .setVisible(false);
    this.cigaretteGlow = this.add.graphics().setDepth(6).setVisible(false);
    this.cigaretteFx = this.add.graphics().setDepth(9);
    this.objectHighlight = this.add.graphics().setDepth(8).setAlpha(0);
    this.chapterTitle = this.add
      .text(240, 135, '', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '20px',
        color: '#e4e0d7',
        resolution: 1,
        shadow: {
          offsetX: 1,
          offsetY: 1,
          color: '#05070b',
          blur: 0,
          stroke: true,
          fill: true,
        },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(80)
      .setVisible(false);
    this.rainWash = this.add
      .rectangle(240, 135, GAME_WIDTH, GAME_HEIGHT, 0x101a2a, 1)
      .setScrollFactor(0)
      .setDepth(71)
      .setAlpha(0)
      .setVisible(false);
    this.rainStreaks = this.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(72)
      .setVisible(false);
    this.finalExitPrompt = this.add
      .text(240, 166, '按 Esc 返回主世界', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '9px',
        color: '#d5dbe0',
        backgroundColor: '#08101dcc',
        padding: { x: 4, y: 2 },
        resolution: 1,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(77)
      .setAlpha(0)
      .setVisible(false);
    const photoTexture = createYinTianPhotoTexture(this);
    this.photoSmall = this.createPhotoFrame(photoTexture)
      .setPosition(YIN_TIAN_PHOTO_X, YIN_TIAN_PHOTO_Y)
      .setDepth(4);
    this.photoDim = this.add
      .rectangle(240, 135, GAME_WIDTH, GAME_HEIGHT, 0x05080a, 1)
      .setScrollFactor(0)
      .setDepth(70)
      .setAlpha(0)
      .setVisible(false);
    this.photoOverlay = this.createPhotoFrame(photoTexture)
      .setScrollFactor(0)
      .setDepth(74)
      .setVisible(false);
    this.traveler = new Traveler(
      this,
      YIN_TIAN_PLAYER_START_X,
      YIN_TIAN_GROUND_Y,
    );
    this.narration = new NarrationSystem(this);
    this.storyDirector = new StoryDirector(this, YIN_TIAN_EVENTS);
    this.interactions = new InteractionSystem(this, this.traveler);
    this.interactions.addTarget({
      id: 'room1-exit',
      x: 30,
      y: YIN_TIAN_GROUND_Y,
      range: 22,
      label: '返回主世界',
      onInteract: () => this.returnToHub(),
    });
    this.interactions.addTarget({
      id: 'room1-cigarette',
      x: YIN_TIAN_CIGARETTE_X,
      y: YIN_TIAN_GROUND_Y,
      range: 30,
      label: '触碰',
      name: '半根香烟',
      nameRange: 55,
      nameOffsetY: 52,
      onInteract: () => this.startCigaretteEvent(),
    });
    this.interactions.addTarget({
      id: 'room1-photo',
      x: YIN_TIAN_PHOTO_X,
      y: YIN_TIAN_GROUND_Y,
      range: 30,
      label: '观察',
      name: '一张照片',
      nameRange: 54,
      nameOffsetY: 54,
      onInteract: () => this.startPhotoEvent(),
    });
    this.interactions.addTarget({
      id: 'room2-tie',
      x: YIN_TIAN_TIE_X,
      y: 248,
      range: 30,
      label: '查看',
      name: '松开的领带',
      nameRange: 40,
      nameOffsetY: 15,
      onInteract: () => this.inspectRoom2Object(
        'room2-tie',
        YIN_TIAN_TIE_X,
        247,
        0x9f5360,
      ),
    });
    this.interactions.addTarget({
      id: 'room2-heels',
      x: YIN_TIAN_HEELS_X,
      y: 248,
      range: 30,
      label: '查看',
      name: '散落的高跟鞋',
      nameRange: 40,
      nameOffsetY: 15,
      onInteract: () => this.inspectRoom2Object(
        'room2-heels',
        YIN_TIAN_HEELS_X,
        247,
        0xb97b66,
      ),
    });
    this.interactions.addTarget({
      id: 'room2-torn-photo',
      x: YIN_TIAN_TORN_PHOTO_X,
      y: 248,
      range: 30,
      label: '查看',
      name: '撕碎的照片',
      nameRange: 44,
      nameOffsetY: 15,
      onInteract: () => this.inspectRoom2Object(
        'room2-torn-photo',
        YIN_TIAN_TORN_PHOTO_X,
        252,
        0xc5b8a3,
      ),
    });
    this.interactions.addTarget({
      id: 'room2-wine',
      x: YIN_TIAN_WINE_X,
      y: 248,
      range: 30,
      label: '查看',
      name: '打翻的红酒杯',
      nameRange: 44,
      nameOffsetY: 15,
      onInteract: () => this.inspectRoom2Object(
        'room2-wine',
        YIN_TIAN_WINE_X,
        248,
        0x8c3545,
      ),
    });
    this.interactions.addTarget({
      id: 'room3-butt',
      x: YIN_TIAN_BUTT_X,
      y: YIN_TIAN_GROUND_Y,
      range: 42,
      label: '查看',
      name: '熄灭的烟头',
      nameRange: 58,
      nameOffsetY: 42,
      onInteract: () => this.pulseRoom3Butt(),
    });

    this.cameras.main.setBounds(
      0,
      0,
      YIN_TIAN_WORLD_WIDTH,
      GAME_HEIGHT,
    );
    this.cameras.main.setBackgroundColor('#171b1f');
    this.createPauseOverlay();
    this.time.delayedCall(250, () => {
      this.showChapterTitle('【沉淀】');
    });
    this.time.delayedCall(2900, () => {
      this.narration.show(
        '门没锁。\n思绪在阴暗的房间里，一点点沉淀。',
        3500,
        134,
      );
    });
  }

  update(_time: number, delta: number): void {
    if (
      this.endingAwaitingExit &&
      Phaser.Input.Keyboard.JustDown(this.keys.pause)
    ) {
      this.finishRoom3ToHub();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      this.setPaused(!this.paused);
    }

    if (this.paused) {
      this.traveler.stop();
      return;
    }

    this.environment.update(delta);
    this.room2Environment.update(delta);
    this.room3Environment.update(delta);
    this.updateCigaretteEffect(delta);
    this.room2Environment.setVignetteActive(
      this.traveler.x >= YIN_TIAN_ROOM2_START_X - 28 &&
      this.traveler.x < YIN_TIAN_ROOM2_END_X + 24,
    );
    if (
      !this.room2TransitionPlayed &&
      this.traveler.x >= YIN_TIAN_ROOM2_START_X - 35
    ) {
      this.room2TransitionPlayed = true;
      this.playRoom2Transition();
    }
    if (!this.cameraFollowing && this.traveler.x >= 440) {
      this.cameraFollowing = true;
      this.cameras.main.startFollow(this.traveler, true, 0.08, 0.08);
    }

    if (this.inputLocked) {
      this.traveler.stop();
      return;
    }

    const moveLeft = this.keys.leftA.isDown || this.keys.leftArrow.isDown;
    const moveRight = this.keys.rightD.isDown || this.keys.rightArrow.isDown;
    const direction = moveLeft === moveRight ? 0 : moveLeft ? -1 : 1;
    this.traveler.x = Phaser.Math.Clamp(
      this.traveler.x + direction * PLAYER_SPEED * (delta / 1000),
      PLAYER_LEFT_LIMIT,
      YIN_TIAN_PLAYER_END_X,
    );
    this.traveler.updateMotion(direction, delta);
    if (!this.room2ChapterShown && this.traveler.x >= YIN_TIAN_ROOM2_START_X + 8) {
      this.room2ChapterShown = true;
      this.showChapterTitle('【倦怠】');
    }
    if (!this.room3ChapterShown && this.traveler.x >= YIN_TIAN_ROOM3_START_X + 24) {
      this.room3ChapterShown = true;
      this.showChapterTitle('【清醒】');
    }
    this.interactions.update();
    this.maybeStartRoom2Memory();
    this.maybeStartRoom3Event();
  }

  private startCigaretteEvent(): void {
    const event = this.storyDirector.begin(
      'room1-cigarette',
      this.traveler.x,
    );
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();
    this.cigaretteElapsed = 0;
    this.cigaretteActive = true;
    this.cigaretteGlow.setVisible(true);
    this.narration.playOnce(
      'yintian-room1-cigarette',
      '香烟，氲成一滩光圈。',
    );
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishCigaretteEvent(event);
    });
  }

  private finishCigaretteEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.interactions.setTargetEnabled('room1-cigarette', false);
    this.cigaretteActive = false;
    this.cigaretteFx.clear();
    this.cigaretteGlow.clear().setVisible(false);
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
  }

  private startPhotoEvent(): void {
    const event = this.storyDirector.begin('room1-photo', this.traveler.x);
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();
    this.photoSmall.setVisible(false);
    this.photoDim.setVisible(true).setAlpha(0);
    this.photoOverlay
      .setPosition(YIN_TIAN_PHOTO_X, YIN_TIAN_PHOTO_Y)
      .setScale(1)
      .setVisible(true)
      .setAlpha(1);
    this.tweens.add({
      targets: this.photoDim,
      alpha: 0.72,
      duration: 260,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: this.photoOverlay,
      x: GAME_WIDTH / 2,
      y: 151,
      scale: 4,
      duration: 650,
      ease: 'Sine.easeInOut',
    });
    this.scheduleEventStep(700, () => {
      this.narration.playOnce(
        'yintian-room1-photo',
        '傻傻两个人，笑的多甜。',
        34,
      );
    });
    this.scheduleEventStep(3200, () => {
      this.tweens.add({
        targets: this.photoOverlay,
        x: YIN_TIAN_PHOTO_X,
        y: YIN_TIAN_PHOTO_Y,
        scale: 1,
        duration: 600,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.photoOverlay.setVisible(false);
          this.photoSmall.setVisible(true);
        },
      });
      this.tweens.add({
        targets: this.photoDim,
        alpha: 0,
        duration: 600,
        onComplete: () => this.photoDim.setVisible(false),
      });
    });
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishPhotoEvent(event);
    });
  }

  private finishPhotoEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.interactions.setTargetEnabled('room1-photo', false);
    this.photoOverlay.setVisible(false);
    this.photoDim.setVisible(false);
    this.photoSmall.setVisible(true);
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
  }

  private createPhotoFrame(
    textureKey: string,
  ): Phaser.GameObjects.Container {
    const frame = this.add.graphics();
    frame.fillStyle(0x17120f);
    frame.fillRect(-23, -23, 46, 46);
    frame.fillStyle(0x5d3e2c);
    frame.fillRect(-21, -21, 42, 42);
    frame.fillStyle(0x8b6547);
    frame.fillRect(-19, -19, 38, 38);
    frame.fillStyle(0x3d281e);
    frame.fillRect(-17, -17, 34, 34);
    frame.fillStyle(0xc09267, 0.52);
    frame.fillRect(-20, -20, 27, 1);
    frame.fillRect(-20, -20, 1, 22);
    frame.fillStyle(0x241810, 0.6);
    frame.fillRect(18, -17, 2, 34);
    frame.fillRect(-17, 18, 36, 2);

    const photo = this.add
      .image(0, 0, textureKey)
      .setDisplaySize(32, 32);
    return this.add.container(0, 0, [frame, photo]);
  }

  private inspectRoom2Object(
    eventId: string,
    x: number,
    y: number,
    color: number,
  ): void {
    const event = this.storyDirector.begin(eventId, this.traveler.x);
    if (!event) {
      return;
    }

    this.storyDirector.complete(event);
    this.tweens.killTweensOf(this.objectHighlight);
    this.objectHighlight.clear().setAlpha(1);
    this.objectHighlight.fillStyle(color, 0.8);
    this.objectHighlight.fillRect(x - 10, y - 9, 20, 1);
    this.objectHighlight.fillRect(x - 10, y + 9, 20, 1);
    this.objectHighlight.fillRect(x - 10, y - 9, 1, 18);
    this.objectHighlight.fillRect(x + 9, y - 9, 1, 18);
    if (event.caption) {
      this.narration.show(
        event.caption,
        event.visualEffect.durationMs,
        44,
      );
    }
    this.tweens.add({
      targets: this.objectHighlight,
      alpha: 0,
      duration: event.visualEffect.durationMs,
      ease: 'Sine.easeOut',
    });
  }

  private maybeStartRoom2Memory(): void {
    if (
      this.inputLocked ||
      this.storyDirector.isCompleted('room2-memory')
    ) {
      return;
    }

    const event = this.storyDirector.begin(
      'room2-memory',
      this.traveler.x,
    );
    if (event) {
      this.startRoom2MemoryEvent(event);
    }
  }

  private startRoom2MemoryEvent(event: StoryEvent): void {
    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();

    this.cameras.main.stopFollow();
    this.cameras.main.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );
    const lines = event.narrationLines ?? [
      '开始总是分分钟都妙不可言。',
      '谁都以为热情它永不会减。',
      '除了激情褪去后的那一点点倦。',
    ];
    this.narration.show(lines[0], 1700, 44);
    this.scheduleEventStep(1800, () => {
      this.memoryFigures.separateBackToBack();
      this.narration.show(lines[1], 1700, 44);
    });
    this.scheduleEventStep(3600, () => {
      this.memoryFigures.stepApartAndDissolve();
      this.room2Environment.breakAndDim();
      this.narration.show(lines[2], 2200, 44);
    });
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishRoom2MemoryEvent(event);
    });
  }

  private showChapterTitle(label: string): void {
    this.tweens.killTweensOf(this.chapterTitle);
    this.chapterTitle
      .setText(label)
      .setVisible(true)
      .setAlpha(0);
    this.tweens.add({
      targets: this.chapterTitle,
      alpha: 1,
      duration: 300,
      hold: 2000,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => this.chapterTitle.setVisible(false),
    });
  }

  private finishRoom2MemoryEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
    this.cameras.main.startFollow(this.traveler, true, 0.08, 0.08);
  }

  private maybeStartRoom3Event(): void {
    if (
      this.inputLocked ||
      this.storyDirector.isCompleted('room3-wedding-window')
    ) {
      return;
    }

    const event = this.storyDirector.begin(
      'room3-wedding-window',
      this.traveler.x,
    );
    if (event) {
      this.startRoom3WeddingEvent(event);
    }
  }

  private startRoom3WeddingEvent(event: StoryEvent): void {
    this.room3Event = event;
    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();
    this.cameras.main.stopFollow();
    this.cameras.main.zoomTo(
      2.3,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );
    this.cameras.main.pan(
      YIN_TIAN_WINDOW_CENTER_X,
      YIN_TIAN_WINDOW_CENTER_Y,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );
    this.room3Environment.startWeddingExit();

    const lines = event.narrationLines ?? [];
    this.scheduleEventStep(1900, () => {
      this.narration.show(lines[0] ?? '', 1900, 135, 1 / 2.3);
    });
    this.scheduleEventStep(3900, () => {
      this.narration.show(lines[1] ?? '', 2000, 135, 1 / 2.3);
    });
    this.scheduleEventStep(6400, () => {
      this.cameras.main.zoomTo(1, 1800, 'Sine.easeInOut');
      this.cameras.main.pan(
        this.traveler.x,
        GAME_HEIGHT / 2,
        1800,
        'Sine.easeInOut',
      );
      this.startRainBlur();
    });
    this.scheduleEventStep(7600, () => {
      this.windowReflection.setVisible(true).setAlpha(0);
      this.tweens.add({
        targets: this.windowReflection,
        alpha: 0.34,
        duration: 700,
      });
    });
    this.scheduleEventStep(9400, () => {
      this.revealRainEnding(event);
    });
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishRoom3ToHub();
    });
  }

  private startRainBlur(): void {
    this.rainWash.setVisible(true).setAlpha(0);
    this.rainStreaks.setVisible(true).clear();
    this.tweens.add({
      targets: this.rainWash,
      alpha: 0.8,
      duration: 3000,
      ease: 'Sine.easeIn',
    });
    this.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 3000,
      ease: 'Sine.easeIn',
      onUpdate: (tween) => {
        this.drawRainBlur(tween.getValue() ?? 0);
      },
    });
  }

  private drawRainBlur(intensity: number): void {
    this.rainStreaks.clear();
    const count = Math.floor(18 + intensity * 92);
    for (let index = 0; index < count; index += 1) {
      const x = (index * 73 + Math.floor(intensity * 31)) % GAME_WIDTH;
      const y = (index * 47 + Math.floor(intensity * 53)) % GAME_HEIGHT;
      const length = 3 + Math.floor(intensity * 13) + (index % 5);
      this.rainStreaks.fillStyle(0xc9d8e1, 0.08 + intensity * 0.44);
      this.rainStreaks.fillRect(x, y, 1, length);
    }
    if (intensity > 0.55) {
      this.rainStreaks.fillStyle(0x9fb6c5, 0.12);
      for (let index = 0; index < 9; index += 1) {
        const y = 22 + index * 28;
        this.rainStreaks.fillRect(
          8 + (index % 3) * 7,
          y,
          464 - (index % 4) * 12,
          2,
        );
      }
    }
  }

  private revealRainEnding(event: StoryEvent): void {
    if (this.room3ExitHandled) {
      return;
    }

    this.room3Event = event;
    this.endingAwaitingExit = true;
    this.narration.show(
      '感情说穿了，\n一人挣脱的，一人去捡。',
      6000,
      116,
    );
    this.finalExitPrompt
      .setVisible(true)
      .setAlpha(0);
    this.tweens.add({
      targets: this.finalExitPrompt,
      alpha: 1,
      duration: 420,
    });
  }

  private finishRoom3ToHub(): void {
    if (this.room3ExitHandled) {
      return;
    }

    this.room3ExitHandled = true;
    this.endingAwaitingExit = false;
    if (this.room3Event) {
      this.storyDirector.complete(this.room3Event);
    }
    this.finalExitPrompt.setVisible(false);
    this.cameras.main.fadeOut(420, 0, 0, 0);
    this.time.delayedCall(430, () => {
      this.input.keyboard?.resetKeys();
      this.scene.wake('HubScene');
      this.scene.sleep();
    });
  }

  private pulseRoom3Butt(): void {
    this.tweens.killTweensOf(this.objectHighlight);
    this.objectHighlight.clear().setAlpha(1);
    this.objectHighlight.fillStyle(0xd5c8b8, 0.52);
    this.objectHighlight.fillRect(YIN_TIAN_BUTT_X - 5, 198, 16, 1);
    this.objectHighlight.fillRect(YIN_TIAN_BUTT_X - 5, 203, 16, 1);
    this.objectHighlight.fillRect(YIN_TIAN_BUTT_X - 5, 198, 1, 6);
    this.objectHighlight.fillRect(YIN_TIAN_BUTT_X + 10, 198, 1, 6);
    this.tweens.add({
      targets: this.objectHighlight,
      alpha: 0,
      duration: 900,
      ease: 'Sine.easeOut',
    });
  }

  private playRoom2Transition(): void {
    const tint = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xe3a15a, 1)
      .setScrollFactor(0)
      .setDepth(16)
      .setAlpha(0);
    const ripple = this.add
      .graphics()
      .setScrollFactor(0)
      .setDepth(17)
      .setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2)
      .setAlpha(0)
      .setScale(0.62);
    ripple.lineStyle(2, 0xffd08a, 0.7);
    ripple.strokeCircle(0, 0, 28);
    ripple.lineStyle(1, 0xf1b56d, 0.5);
    ripple.strokeCircle(0, 0, 52);
    ripple.strokeCircle(0, 0, 74);
    ripple.fillStyle(0xffdb9f, 0.12);
    ripple.fillRect(-220, -16, 440, 3);
    ripple.fillRect(-210, 24, 420, 2);

    this.tweens.add({
      targets: tint,
      alpha: 0.3,
      duration: 180,
      yoyo: true,
      hold: 260,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: ripple,
      alpha: { from: 0, to: 0.78 },
      scale: 1.7,
      duration: 800,
      ease: 'Sine.easeOut',
      onComplete: () => {
        ripple.destroy();
        tint.destroy();
      },
    });
  }

  private updateCigaretteEffect(delta: number): void {
    if (!this.cigaretteActive) {
      return;
    }

    this.cigaretteElapsed += delta;
    const elapsed = this.cigaretteElapsed;
    const flicker = 0.45 + Math.abs(Math.sin(elapsed / 86)) * 0.5;
    this.cigaretteGlow.clear();
    this.cigaretteGlow.fillStyle(0xff713f, flicker);
    this.cigaretteGlow.fillRect(CIGARETTE_TIP_X, CIGARETTE_TIP_Y, 2, 2);
    this.cigaretteGlow.fillStyle(0xffc06a, flicker * 0.55);
    this.cigaretteGlow.fillRect(CIGARETTE_TIP_X - 1, CIGARETTE_TIP_Y - 1, 4, 1);

    this.cigaretteFx.clear();
    const smokeColor = 0xd4d1cb;
    for (let index = 0; index < 12; index += 1) {
      const phase = ((elapsed / 920) + index / 12) % 1;
      const rise = phase * 54;
      const sway = Math.sin(elapsed / 230 + phase * 6.2) *
        Phaser.Math.Clamp(rise / 38, 0, 1) * 5;
      const fadeIn = Phaser.Math.Clamp(rise / 18, 0, 1);
      const fadeOut = 1 - Phaser.Math.Clamp((rise - 38) / 16, 0, 1);
      this.cigaretteFx.fillStyle(
        smokeColor,
        fadeIn * fadeOut * 0.42,
      );
      this.cigaretteFx.fillRect(
        Math.round(CIGARETTE_TIP_X + sway),
        Math.round(CIGARETTE_TIP_Y - 3 - rise),
        2,
        2,
      );
    }

    if (elapsed < 650) {
      return;
    }

    const ringProgress = Phaser.Math.Clamp((elapsed - 650) / 2200, 0, 1);
    const ringAlpha = Math.sin(ringProgress * Math.PI) * 0.48;
    const ringRadius = 4 + ringProgress * 10;
    const centerX = CIGARETTE_TIP_X +
      Math.sin(elapsed / 320) * 4;
    const centerY = CIGARETTE_TIP_Y - 43;
    const rotation = elapsed / 680;
    this.cigaretteFx.fillStyle(0xc9b9a7, ringAlpha);
    for (let index = 0; index < 20; index += 1) {
      const angle = rotation + (index / 20) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * ringRadius;
      const y = centerY + Math.sin(angle) * (ringRadius * 0.62);
      this.cigaretteFx.fillRect(Math.round(x), Math.round(y), 2, 2);
    }
  }

  private scheduleEventStep(delayMs: number, callback: () => void): void {
    this.time.delayedCall(delayMs, callback);
  }

  private createPauseOverlay(): void {
    const shade = this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x050607,
      0.76,
    );
    const title = this.add
      .text(GAME_WIDTH / 2, 122, '已暂停', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '20px',
        color: '#e6e8e7',
        resolution: 1,
      })
      .setOrigin(0.5);
    const hint = this.add
      .text(GAME_WIDTH / 2, 148, '按 Esc 继续', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '10px',
        color: '#aeb4b7',
        resolution: 1,
      })
      .setOrigin(0.5);

    this.pauseOverlay = this.add
      .container(0, 0, [shade, title, hint])
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  private setPaused(paused: boolean): void {
    this.paused = paused;
    this.pauseOverlay.setVisible(paused);
    this.interactions.setEnabled(!paused && !this.inputLocked);
    this.traveler.stop();
    this.input.keyboard?.resetKeys();
  }

  private returnToHub(): void {
    this.input.keyboard?.resetKeys();
    this.scene.wake('HubScene');
    this.scene.sleep();
  }
}
