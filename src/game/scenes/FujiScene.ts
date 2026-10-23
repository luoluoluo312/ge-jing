import Phaser from 'phaser';

import {
  createFujiBackdrop,
  FUJI_GROUND_Y,
  FUJI_WORLD_WIDTH,
} from '../art/createFujiBackdrop';
import {
  ACT2_START_X,
  ACT3_END_X,
  ACT3_START_X,
  createAct2Backdrop,
  createAct3Backdrop,
  FLOWER_SHOP_X,
  type Act3Environment,
} from '../art/createAct23Backdrop';
import {
  ACT4_END_X,
  ACT4_START_X,
  ACT5_CAR_X,
  ACT5_COUPLE_X,
  ACT5_START_X,
  BENCH_X,
  createAct4Backdrop,
  createAct5Backdrop,
  MEMORIAL_STONE_X,
  type Act5Environment,
} from '../art/createAct45Backdrop';
import { FUJI_EVENTS, type StoryEvent } from '../data/fujiEvents';
import { Bench } from '../entities/Bench';
import { Car } from '../entities/Car';
import { FlowerShop } from '../entities/FlowerShop';
import { MemorialStone } from '../entities/MemorialStone';
import { NPC } from '../entities/NPC';
import { SmokingEffect } from '../entities/SmokingEffect';
import { Tram } from '../entities/Tram';
import { Traveler } from '../entities/Traveler';
import { InteractionSystem } from '../systems/InteractionSystem';
import { GroundEffects } from '../systems/GroundEffects';
import { StoryDirector } from '../systems/StoryDirector';
import { WeatherSystem } from '../systems/WeatherSystem';
import { NarrationSystem } from '../systems/NarrationSystem';
import { DialogueBox } from '../ui/DialogueBox';
import { PhoneUI } from '../ui/PhoneUI';
import { WorldMusicPlayer } from '../ui/WorldMusicPlayer';
import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const PLAYER_START_X = 116;
const PLAYER_SPEED = 72;
const PLAYER_MARGIN = 16;
const CAR_X = 350;
const CAR_WINDOW_X = 382;
const RETURN_X = 48;
const ACT3_PAIR_LEFT = 2020;
const ACT3_PAIR_GAP = 34;
const ACT3_PAIR_STOP = 2540;
const ACT5_PAIR_GAP = 54;
const SHADOW_ZONE_MIN = 2550;
const SHADOW_ZONE_MAX = 2630;

type ControlKeys = {
  leftA: Phaser.Input.Keyboard.Key;
  rightD: Phaser.Input.Keyboard.Key;
  leftArrow: Phaser.Input.Keyboard.Key;
  rightArrow: Phaser.Input.Keyboard.Key;
  pause: Phaser.Input.Keyboard.Key;
};

export class FujiScene extends Phaser.Scene {
  private traveler!: Traveler;
  private male!: NPC;
  private female!: NPC;
  private memoryMale!: NPC;
  private memoryFemale!: NPC;
  private car!: Car;
  private flowerShop!: FlowerShop;
  private tram!: Tram;
  private act3Environment!: Act3Environment;
  private act5Environment!: Act5Environment;
  private act5Car!: Car;
  private memorialStone!: MemorialStone;
  private bench!: Bench;
  private shadowLayer!: Phaser.GameObjects.Graphics;
  private breathLayer!: Phaser.GameObjects.Graphics;
  private breathElapsed = 0;
  private groundEffects!: GroundEffects;
  private revisitVeil!: Phaser.GameObjects.Rectangle;
  private firstActItem?: Phaser.GameObjects.Graphics;
  private coatItem?: Phaser.GameObjects.Graphics;
  private smokingEffect?: SmokingEffect;
  private weather!: WeatherSystem;
  private interactions!: InteractionSystem;
  private dialogue!: DialogueBox;
  private phoneUI!: PhoneUI;
  private narration!: NarrationSystem;
  private pauseOverlay!: Phaser.GameObjects.Container;
  private keys!: ControlKeys;
  private storyDirector!: StoryDirector;
  private inputLocked = false;
  private paused = false;
  private memoryPairStopped = false;
  private memoryPairDeparting = false;
  private tramStarted = false;
  private act5Initialized = false;
  private stoneCarried = false;
  private coatTransferred = false;
  private femaleWalkingToBench = false;
  private benchReady = false;
  private finaleSitting = false;
  private shadowOverlay?: Phaser.GameObjects.Graphics;
  private phoneCallActive = false;
  private phoneFallbackTimer?: Phaser.Time.TimerEvent;
  private readonly eventTimers: Phaser.Time.TimerEvent[] = [];

  constructor() {
    super('FujiScene');
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
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    }) as ControlKeys;

    createFujiBackdrop(this);
    createAct2Backdrop(this);
    this.act3Environment = createAct3Backdrop(this);
    createAct4Backdrop(this);
    this.act5Environment = createAct5Backdrop(this);

    this.car = new Car(this, CAR_X, FUJI_GROUND_Y);
    this.male = new NPC(this, 426, FUJI_GROUND_Y, 'male', 1);
    this.male.setWetShoulder(true);
    this.female = new NPC(this, 454, FUJI_GROUND_Y, 'female', -1);
    this.memoryMale = new NPC(
      this,
      ACT3_PAIR_LEFT,
      FUJI_GROUND_Y,
      'male',
      1,
    );
    this.memoryFemale = new NPC(
      this,
      ACT3_PAIR_LEFT + ACT3_PAIR_GAP,
      FUJI_GROUND_Y,
      'female',
      -1,
    );
    this.flowerShop = new FlowerShop(this, FLOWER_SHOP_X, FUJI_GROUND_Y);
    this.tram = new Tram(this, 202);
    this.act5Car = new Car(this, ACT5_CAR_X, FUJI_GROUND_Y);
    this.memorialStone = new MemorialStone(
      this,
      MEMORIAL_STONE_X,
      FUJI_GROUND_Y,
    );
    this.bench = new Bench(this, BENCH_X, FUJI_GROUND_Y);
    this.traveler = new Traveler(this, PLAYER_START_X, FUJI_GROUND_Y);
    this.weather = new WeatherSystem(this, FUJI_WORLD_WIDTH);
    this.groundEffects = new GroundEffects(this, FUJI_GROUND_Y);
    this.shadowLayer = this.add.graphics().setDepth(3);
    this.breathLayer = this.add.graphics().setDepth(9);
    this.revisitVeil = this.add
      .rectangle(240, 135, 480, 270, 0x071226, 0.28)
      .setScrollFactor(0)
      .setDepth(15)
      .setVisible(false);
    this.dialogue = new DialogueBox(this);
    this.phoneUI = new PhoneUI(this, () => this.acceptPhoneCall());
    this.narration = new NarrationSystem(this);
    new WorldMusicPlayer(
      this,
      '《富士山下》',
      'assets/audio/fuji.mp3',
    );
    this.storyDirector = new StoryDirector(this, FUJI_EVENTS);
    this.time.delayedCall(350, () => {
      this.narration.show(
        '富士山下，一场关于告别与释怀的旧梦。',
        3500,
      );
    });

    this.interactions = new InteractionSystem(this, this.traveler);
    this.interactions.addTarget({
      id: 'return-to-hub',
      x: RETURN_X,
      y: FUJI_GROUND_Y,
      range: 30,
      label: '返回主世界',
      onInteract: () => this.returnToHub(),
    });
    this.interactions.addTarget({
      id: 'car-window',
      x: CAR_WINDOW_X,
      y: FUJI_GROUND_Y,
      range: 40,
      label: '观察车窗',
      name: '雨夜车窗',
      nameRange: 72,
      nameOffsetY: 60,
      onInteract: () => this.startWindowEvent(),
    });
    this.interactions.addTarget({
      id: 'flower-window',
      x: FLOWER_SHOP_X - 12,
      y: FUJI_GROUND_Y,
      range: 44,
      label: '观察橱窗',
      name: '枯萎的橱窗',
      nameRange: 82,
      nameOffsetY: 124,
      onInteract: () => this.startFlowerMemoryEvent(),
    });
    this.interactions.addTarget({
      id: 'memorial-stone',
      x: MEMORIAL_STONE_X,
      y: FUJI_GROUND_Y,
      range: 38,
      label: '触碰',
      name: '纪念石',
      nameRange: 76,
      nameOffsetY: 42,
      onInteract: () => this.toggleMemorialStone(),
    });
    this.interactions.addTarget({
      id: 'bench-sit',
      x: BENCH_X,
      y: FUJI_GROUND_Y,
      range: 52,
      label: '坐下',
      name: '长椅',
      nameRange: 88,
      nameOffsetY: 50,
      interactive: false,
      onInteract: () => this.startFinale(),
    });
    this.interactions.addTarget({
      id: 'finale-return',
      x: BENCH_X + 22,
      y: FUJI_GROUND_Y,
      range: 58,
      label: '返回主世界',
      enabled: false,
      onInteract: () => this.returnToHub(),
    });
    this.interactions.setTargetEnabled(
      'car-window',
      !this.storyDirector.isCompleted('car-window-reflection'),
    );
    this.interactions.setTargetEnabled(
      'flower-window',
      !this.storyDirector.isCompleted('flower-window-memory'),
    );
    if (this.storyDirector.isCompleted('flower-window-memory')) {
      this.flowerShop.restoreCompletedState();
    }
    this.interactions.setTargetInteractive('bench-sit', false);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, FUJI_WORLD_WIDTH, GAME_HEIGHT);
    camera.startFollow(this.traveler, true, 0.12, 0.12);

    this.createPauseOverlay();
    this.events.on(Phaser.Scenes.Events.WAKE, this.handleWake, this);
  }

  update(_time: number, delta: number): void {
    if (Phaser.Input.Keyboard.JustDown(this.keys.pause)) {
      this.setPaused(!this.paused);
    }

    if (this.paused) {
      this.traveler.stop();
      return;
    }

    const act3Progress = Phaser.Math.Clamp(
      (this.traveler.x - ACT3_START_X) / (ACT3_END_X - ACT3_START_X),
      0,
      1,
    );
    const inAct3 =
      this.traveler.x >= ACT3_START_X && this.traveler.x < ACT4_START_X;
    const inAct4 =
      this.traveler.x >= ACT4_START_X && this.traveler.x < ACT5_START_X;
    const inAct5 = this.traveler.x >= ACT5_START_X;
    const coldRevisit =
      this.coatTransferred && this.traveler.x < ACT2_START_X;
    this.revisitVeil.setVisible(coldRevisit);
    this.male.setVisible(!coldRevisit);
    this.female.setVisible(!coldRevisit);
    this.smokingEffect?.setVisible(
      !coldRevisit && this.storyDirector.isCompleted('car-window-reflection'),
    );
    if (
      !this.inputLocked &&
      (inAct3 || inAct4 || (inAct5 && !this.coatTransferred))
    ) {
      this.weather.setOpacity(1);
    }
    if (coldRevisit) {
      this.weather.setOpacity(0.24);
    }
    const seasonProgress = inAct4
      ? 1 -
        Phaser.Math.Clamp(
          (this.traveler.x - ACT4_START_X) / (ACT4_END_X - ACT4_START_X),
          0,
          1,
        )
      : act3Progress;
    this.weather.update(
      delta,
      inAct3 || inAct4 ? 'seasonal' : 'rain',
      seasonProgress,
    );
    this.act3Environment.update(inAct3 ? act3Progress : 0);
    this.act5Environment.update(
      this.coatTransferred
        ? Phaser.Math.Clamp(
            (this.traveler.x - ACT5_COUPLE_X) / (BENCH_X - ACT5_COUPLE_X),
            0,
            1,
          )
        : 0,
      inAct5,
    );
    this.male.updateIdle(delta);
    this.female.updateIdle(delta);
    this.smokingEffect?.update(delta);
    this.memoryMale.updateIdle(delta);
    this.memoryFemale.updateIdle(delta);

    if (this.inputLocked) {
      this.traveler.stop();
      return;
    }

    if (this.finaleSitting) {
      this.traveler.stop();
      this.interactions.update();
      return;
    }

    const moveLeft = this.keys.leftA.isDown || this.keys.leftArrow.isDown;
    const moveRight = this.keys.rightD.isDown || this.keys.rightArrow.isDown;
    const direction = moveLeft === moveRight ? 0 : moveLeft ? -1 : 1;

    this.traveler.x = Phaser.Math.Clamp(
      this.traveler.x + direction * PLAYER_SPEED * (delta / 1000),
      PLAYER_MARGIN,
      FUJI_WORLD_WIDTH - PLAYER_MARGIN,
    );
    this.traveler.updateMotion(direction, delta);
    this.updateBreath(delta, inAct4, direction === 0);
    this.groundEffects.update(
      delta,
      this.traveler.x,
      FUJI_GROUND_Y,
      inAct4 ? 'snow' : this.traveler.x < ACT2_START_X ? 'rain' : 'none',
      direction !== 0,
    );
    this.initializeAct5IfNeeded(inAct5);
    this.updateMemoryPair(delta);
    this.updateBenchCompanion(delta);
    this.memorialStone.followPlayer(this.traveler.x, this.traveler.y);
    this.drawLongShadows(inAct3);
    this.interactions.update();
    this.maybeStartPhoneCall();
    this.maybeStartTram();
    this.maybeStartShadowEvent();
    this.maybeStartAct4Events(inAct4);
    this.maybeStartCoatTransfer(inAct5);
  }

  private startWindowEvent(): void {
    const event = this.storyDirector.begin('car-window-reflection', this.traveler.x);
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();

    const camera = this.cameras.main;
    camera.stopFollow();
    camera.zoomTo(1.3, event.cameraCue.durationMs, 'Sine.easeInOut');
    camera.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );

    if (event.dialogue) {
      this.dialogue.show(
        event.dialogue.title,
        event.dialogue.body,
        event.dialogue.footer,
      );
    }

    this.scheduleEventStep(620, () => this.male.setPose('collar'));
    this.scheduleEventStep(1050, () => {
      this.male.setPose('offer');
      this.firstActItem = this.add.graphics().setDepth(9);
      this.firstActItem.fillStyle(0x3a2b22);
      this.firstActItem.fillRect(-5, -4, 10, 8);
      this.firstActItem.fillStyle(0xb89462);
      this.firstActItem.fillRect(-3, -2, 6, 4);
      this.firstActItem.setPosition(439, 214).setAlpha(0);
      this.tweens.add({
        targets: this.firstActItem,
        alpha: 1,
        duration: 220,
      });
    });
    this.scheduleEventStep(1380, () => {
      this.female.setPose('receive');
      if (this.firstActItem) {
        this.tweens.add({
          targets: this.firstActItem,
          x: 452,
          y: 212,
          duration: 420,
          ease: 'Sine.easeInOut',
        });
      }
    });
    this.scheduleEventStep(1900, () => {
      this.male.setPose('concern');
      if (this.firstActItem) {
        this.tweens.add({
          targets: this.firstActItem,
          alpha: 0,
          duration: 260,
        });
      }
    });
    this.scheduleEventStep(2350, () => {
      this.dialogue.hide();
      this.car.showWindowReflection();
    });
    this.scheduleEventStep(3650, () => this.car.hideWindowReflection());
    this.scheduleEventStep(event.visualEffect.durationMs + 2250, () => {
      this.finishWindowEvent(event);
    });
  }

  private finishWindowEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.interactions.setTargetEnabled('car-window', false);
    this.dialogue.hide();
    this.car.hideWindowReflection();
    this.male.setPose('smoke');
    this.female.setPose('idle');
    this.firstActItem?.destroy();
    this.firstActItem = undefined;
    this.smokingEffect = new SmokingEffect(this, this.male.x, this.male.y);
    this.smokingEffect.start();
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
    this.cameras.main.zoomTo(1, 600, 'Sine.easeInOut');
    this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
    this.narration.playOnce(
      'act1-rain',
      '雨下得好大，\n像是在掩饰什么。',
    );
  }

  private startFlowerMemoryEvent(): void {
    const event = this.storyDirector.begin(
      'flower-window-memory',
      this.traveler.x,
    );
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();

    const camera = this.cameras.main;
    camera.stopFollow();
    camera.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );

    this.tweens.addCounter({
      from: 1,
      to: 0.16,
      duration: 900,
      onUpdate: (tween) => this.weather.setOpacity(tween.getValue() ?? 0),
    });
    this.flowerShop.beginMemoryTransition();
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishFlowerMemoryEvent(event);
    });
  }

  private maybeStartPhoneCall(): void {
    if (this.storyDirector.isCompleted('flower-phone-call')) {
      return;
    }

    const event = this.storyDirector.begin(
      'flower-phone-call',
      this.traveler.x,
    );
    if (event) {
      this.startPhoneCall(event);
    }
  }

  private startPhoneCall(event: StoryEvent): void {
    this.phoneCallActive = true;
    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();
    this.phoneUI.showIncoming();
    this.phoneFallbackTimer = this.time.delayedCall(
      event.visualEffect.durationMs,
      () => this.finishPhoneCall(event),
    );
  }

  private acceptPhoneCall(): void {
    if (!this.phoneCallActive) {
      return;
    }

    this.phoneFallbackTimer?.remove(false);
    this.phoneUI.showMessage(
      '路过花店，\n想起你曾喜欢\n那里的白桔梗。',
    );
    this.time.delayedCall(3200, () => {
      const event = FUJI_EVENTS.find(
        (candidate) => candidate.id === 'flower-phone-call',
      );
      if (event) {
        this.finishPhoneCall(event);
      }
    });
  }

  private finishPhoneCall(event: StoryEvent): void {
    if (!this.phoneCallActive) {
      return;
    }

    this.phoneCallActive = false;
    this.phoneFallbackTimer?.remove(false);
    this.storyDirector.complete(event);
    this.phoneUI.hide();
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
  }

  private finishFlowerMemoryEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.interactions.setTargetEnabled('flower-window', false);
    this.flowerShop.settleMemory();
    this.tweens.addCounter({
      from: 0.16,
      to: 0.72,
      duration: 700,
      onUpdate: (tween) => this.weather.setOpacity(tween.getValue() ?? 0),
    });
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
    this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
    this.narration.playOnce(
      'act2-flowers-after-memory',
      '花虽然开了，\n但看花的人已经不在了。',
    );
  }

  private updateMemoryPair(delta: number): void {
    if (!this.storyDirector.isCompleted('flower-window-memory')) {
      return;
    }

    if (this.storyDirector.isCompleted('shadow-overlap')) {
      if (this.act5Initialized) {
        return;
      }

      if (!this.memoryPairDeparting) {
        this.memoryPairDeparting = true;
        this.memoryMale.setFacing(1);
        this.memoryFemale.setFacing(1);
        this.narration.playOnce(
          'act3-pair-departure',
          '有些路，\n只能陪着走这一段了。',
        );
      }

      this.memoryMale.x += 88 * (delta / 1000);
      this.memoryFemale.x = this.memoryMale.x + ACT3_PAIR_GAP;
      const fade = 1 - Phaser.Math.Clamp(
        (this.memoryMale.x - ACT4_START_X) / (ACT4_END_X - ACT4_START_X),
        0,
        1,
      );
      const alpha = Phaser.Math.Clamp(fade * 1.6, 0, 1);
      this.memoryMale.setAlpha(alpha).setVisible(alpha > 0.01);
      this.memoryFemale.setAlpha(alpha).setVisible(alpha > 0.01);
      return;
    }

    if (this.memoryPairStopped) {
      return;
    }

    if (this.traveler.x > ACT3_START_X - 70) {
      this.memoryMale.x = Math.min(
        ACT3_PAIR_STOP,
        this.memoryMale.x + 64 * (delta / 1000),
      );
      this.memoryFemale.x = this.memoryMale.x + ACT3_PAIR_GAP;
      if (this.memoryMale.x >= ACT3_PAIR_STOP) {
        this.memoryPairStopped = true;
      }
    }
  }

  private updateBreath(delta: number, inAct4: boolean, idle: boolean): void {
    this.breathLayer.clear();
    if (!inAct4 || !idle) {
      this.breathElapsed = 0;
      return;
    }

    this.breathElapsed += delta;
    const cycle = this.breathElapsed % 1800;
    if (cycle < 1050) {
      return;
    }

    const alpha = Math.min(1, (cycle - 1050) / 350) * (1 - (cycle - 1050) / 750);
    const rise = Math.min(8, (cycle - 1050) / 70);
    for (const npc of [this.memoryMale, this.memoryFemale]) {
      if (!npc.visible) {
        continue;
      }
      this.breathLayer.fillStyle(0xe5ecec, alpha * 0.48 * npc.alpha);
      this.breathLayer.fillRect(
        Math.round(npc.x + 3),
        Math.round(npc.y - 39 - rise),
        4,
        2,
      );
      this.breathLayer.fillStyle(0xc7d4d6, alpha * 0.32 * npc.alpha);
      this.breathLayer.fillRect(
        Math.round(npc.x + 6),
        Math.round(npc.y - 43 - rise),
        2,
        2,
      );
    }
  }

  private initializeAct5IfNeeded(inAct5: boolean): void {
    if (!inAct5 || this.act5Initialized) {
      return;
    }

    this.act5Initialized = true;
    const coatDone = this.storyDirector.isCompleted('coat-transfer');
    const finaleDone = this.storyDirector.isCompleted('bench-finale');

    if (!coatDone) {
      this.memoryMale
        .setPosition(ACT5_COUPLE_X, FUJI_GROUND_Y)
        .setAlpha(1)
        .setVisible(true)
        .setCoatWorn(true)
        .setSitting(false);
      this.memoryFemale
        .setPosition(ACT5_COUPLE_X + ACT5_PAIR_GAP, FUJI_GROUND_Y)
        .setAlpha(1)
        .setVisible(true)
        .setCoatWorn(false)
        .setSitting(false);
      this.memoryMale.setFacing(1);
      this.memoryFemale.setFacing(-1);
      return;
    }

    this.coatTransferred = true;
    this.memoryMale.setCoatWorn(false).setFacing(1);
    this.memoryFemale
      .setCoatWorn(true)
      .setFacing(1)
      .setVisible(true)
      .setAlpha(1);

    if (finaleDone) {
      this.memoryMale.setVisible(false);
      this.memoryFemale.setVisible(false);
      this.interactions.setTargetInteractive('bench-sit', false);
      this.interactions.setTargetEnabled('finale-return', true);
      return;
    }

    this.memoryFemale
      .setPosition(BENCH_X + 22, FUJI_GROUND_Y)
      .setAlpha(1)
      .setVisible(true)
      .setSitting(true);
    this.benchReady = true;
    this.interactions.setTargetInteractive('bench-sit', true);
  }

  private updateBenchCompanion(delta: number): void {
    if (!this.femaleWalkingToBench) {
      return;
    }

    this.memoryFemale.x = Math.min(
      BENCH_X + 22,
      this.memoryFemale.x + 70 * (delta / 1000),
    );
    if (this.memoryFemale.x >= BENCH_X + 22) {
      this.memoryFemale.setSitting(true);
      this.femaleWalkingToBench = false;
      this.benchReady = true;
      this.interactions.setTargetInteractive('bench-sit', true);
    }
  }

  private toggleMemorialStone(): void {
    this.stoneCarried = !this.stoneCarried;
    this.memorialStone.setCarried(this.stoneCarried);
    if (this.stoneCarried) {
      this.memorialStone.followPlayer(this.traveler.x, this.traveler.y);
    } else {
      this.memorialStone.returnToGround(
        MEMORIAL_STONE_X,
        FUJI_GROUND_Y,
      );
    }
  }

  private maybeStartAct4Events(inAct4: boolean): void {
    if (!inAct4) {
      return;
    }

    for (const eventId of ['npc-distance', 'memorial-stone-discovery']) {
      if (this.storyDirector.isCompleted(eventId)) {
        continue;
      }
      const event = this.storyDirector.begin(eventId, this.traveler.x);
      if (event) {
        this.storyDirector.complete(event);
        if (eventId === 'npc-distance') {
          this.dialogue.show('雪路', '男：“冷吗？”\n女：“不冷。”', '');
          this.time.delayedCall(2600, () => this.dialogue.hide());
          this.time.delayedCall(3000, () => {
            this.narration.playOnce('act4-distance', '追不上了。');
          });
        }
      }
    }
  }

  private maybeStartCoatTransfer(inAct5: boolean): void {
    if (
      !inAct5 ||
      this.storyDirector.isCompleted('coat-transfer')
    ) {
      return;
    }

    const event = this.storyDirector.begin('coat-transfer', this.traveler.x);
    if (event) {
      this.startCoatTransfer(event);
    }
  }

  private startCoatTransfer(event: StoryEvent): void {
    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();

    const camera = this.cameras.main;
    camera.stopFollow();
    camera.zoomTo(1.3, event.cameraCue.durationMs, 'Sine.easeInOut');
    camera.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );

    if (event.dialogue) {
      this.dialogue.show(
        event.dialogue.title,
        event.dialogue.body,
        event.dialogue.footer,
      );
    }

    this.coatItem = this.add.graphics().setDepth(9).setVisible(false);
    this.coatItem.fillStyle(0x17131b);
    this.coatItem.fillRect(-8, -25, 16, 23);
    this.coatItem.fillRect(-10, -21, 3, 12);
    this.coatItem.fillRect(7, -21, 3, 12);
    this.coatItem.fillStyle(0x7a5b4b);
    this.coatItem.fillRect(-6, -23, 12, 18);
    this.coatItem.fillRect(-8, -19, 2, 9);
    this.coatItem.fillRect(6, -19, 2, 9);
    this.coatItem.fillStyle(0xc19a77);
    this.coatItem.fillRect(-5, -23, 10, 2);
    this.coatItem.fillRect(-6, -11, 12, 2);
    this.coatItem.fillRect(-6, -6, 12, 2);
    this.coatItem.fillStyle(0x2e2930);
    this.coatItem.fillRect(-1, -21, 2, 10);
    this.coatItem.setPosition(this.memoryMale.x, FUJI_GROUND_Y - 6);

    this.scheduleEventStep(650, () => {
      this.memoryMale.setPose('collar');
      this.memoryFemale.setPose('receive');
    });
    this.scheduleEventStep(980, () => {
      this.memoryMale.setPose('offer').setCoatWorn(false);
      this.coatItem?.setVisible(true).setAlpha(0);
      if (this.coatItem) {
        this.tweens.add({
          targets: this.coatItem,
          alpha: 1,
          y: FUJI_GROUND_Y - 10,
          duration: 420,
          ease: 'Sine.easeOut',
        });
      }
    });
    this.scheduleEventStep(1450, () => {
      if (this.coatItem) {
        this.tweens.add({
          targets: this.coatItem,
          x: (this.memoryMale.x + this.memoryFemale.x) / 2,
          y: FUJI_GROUND_Y - 18,
          scaleX: 0.85,
          scaleY: 0.8,
          angle: -80,
          duration: 650,
          ease: 'Sine.easeInOut',
        });
      }
    });
    this.scheduleEventStep(2850, () => {
      this.coatItem?.setAlpha(0);
      this.memoryFemale.setCoatWorn(true);
    });
    this.scheduleEventStep(2250, () => this.dialogue.hide());
    this.scheduleEventStep(3100, () => {
      this.memoryMale.setPose('idle');
      this.memoryFemale.setPose('idle').setFacing(1);
    });
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishCoatTransfer(event);
    });
  }

  private finishCoatTransfer(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.coatTransferred = true;
    this.inputLocked = false;
    this.memoryMale.setPose('idle').setCoatWorn(false);
    this.memoryFemale.setPose('idle').setCoatWorn(true);
    this.coatItem?.destroy();
    this.coatItem = undefined;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
    this.cameras.main.zoomTo(1, 500, 'Sine.easeInOut');
    this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
    this.tweens.addCounter({
      from: 1,
      to: 0,
      duration: 3200,
      onUpdate: (tween) => this.weather.setOpacity(tween.getValue() ?? 0),
    });
    this.femaleWalkingToBench = true;
  }

  private startFinale(): void {
    if (!this.benchReady || this.finaleSitting) {
      return;
    }

    const event = this.storyDirector.begin('bench-finale', this.traveler.x);
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.x = BENCH_X - 22;
    this.traveler.updateMotion(1, 0);
    this.traveler.setSitting(true);

    const camera = this.cameras.main;
    camera.stopFollow();
    camera.zoomTo(1.25, 600, 'Sine.easeInOut');
    camera.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );

    this.scheduleEventStep(1300, () => {
      this.memoryFemale.setSitting(false).setFacing(1);
      this.tweens.add({
        targets: this.memoryFemale,
        x: BENCH_X + 210,
        alpha: 0,
        duration: 2500,
        ease: 'Sine.easeIn',
        onComplete: () => this.memoryFemale.setVisible(false),
      });
    });
    this.scheduleEventStep(1800, () => {
      camera.zoomTo(1, 1800, 'Sine.easeInOut');
    });
    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishFinale(event);
    });
  }

  private finishFinale(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    this.finaleSitting = true;
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setTargetInteractive('bench-sit', false);
    this.interactions.setTargetEnabled('finale-return', true);
    this.interactions.setEnabled(!this.paused);
    this.narration.playOnce(
      'act5-forward',
      '我也该继续走了。',
    );
  }

  private drawLongShadows(inAct3: boolean): void {
    this.shadowLayer.clear();
    if (!inAct3) {
      return;
    }

    this.drawLongShadow(this.traveler.x, 0x29413f, 0.34);
    this.drawLongShadow(this.memoryMale.x, 0x31443e, 0.3);
    this.drawLongShadow(this.memoryFemale.x, 0x2d4244, 0.3);
  }

  private drawLongShadow(x: number, color: number, alpha: number): void {
    this.shadowLayer.fillStyle(color, alpha);
    this.shadowLayer.beginPath();
    this.shadowLayer.moveTo(x - 3, FUJI_GROUND_Y - 2);
    this.shadowLayer.lineTo(x + 45, FUJI_GROUND_Y + 11);
    this.shadowLayer.lineTo(x + 54, FUJI_GROUND_Y + 14);
    this.shadowLayer.lineTo(x + 5, FUJI_GROUND_Y);
    this.shadowLayer.closePath();
    this.shadowLayer.fillPath();
    this.shadowLayer.fillStyle(color, alpha * 0.55);
    this.shadowLayer.fillRect(x + 13, FUJI_GROUND_Y + 7, 29, 2);
  }

  private maybeStartTram(): void {
    if (
      this.tramStarted ||
      !this.storyDirector.isCompleted('flower-window-memory') ||
      this.traveler.x < ACT3_START_X + 280
    ) {
      return;
    }

    this.tramStarted = true;
    this.tram.pass(this.cameras.main, ACT3_END_X + 120, ACT3_START_X + 100);
  }

  private maybeStartShadowEvent(): void {
    if (
      !this.storyDirector.isCompleted('flower-window-memory') ||
      this.storyDirector.isCompleted('shadow-overlap') ||
      this.memoryMale.x < ACT3_PAIR_STOP - 2 ||
      this.traveler.x < SHADOW_ZONE_MIN ||
      this.traveler.x > SHADOW_ZONE_MAX
    ) {
      return;
    }

    this.startShadowEvent();
  }

  private startShadowEvent(): void {
    const event = this.storyDirector.begin('shadow-overlap', this.traveler.x);
    if (!event) {
      return;
    }

    this.inputLocked = event.lockInput;
    this.interactions.setEnabled(false);
    this.input.keyboard?.resetKeys();
    this.traveler.stop();
    this.weather.freeze(500);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(
      event.cameraCue.focusX,
      event.cameraCue.focusY,
      event.cameraCue.durationMs,
      'Sine.easeInOut',
    );

    this.shadowOverlay = this.add.graphics().setDepth(3.5).setAlpha(0);
    this.drawShadowOverlap(
      this.shadowOverlay,
      (this.memoryMale.x + this.memoryFemale.x) / 2,
    );
    this.tweens.add({
      targets: this.shadowOverlay,
      alpha: 0.9,
      duration: 380,
    });

    this.scheduleEventStep(event.visualEffect.durationMs, () => {
      this.finishShadowEvent(event);
    });
  }

  private finishShadowEvent(event: StoryEvent): void {
    if (!this.inputLocked) {
      return;
    }

    this.storyDirector.complete(event);
    if (this.shadowOverlay) {
      this.tweens.add({
        targets: this.shadowOverlay,
        alpha: 0,
        duration: 500,
        onComplete: () => this.shadowOverlay?.destroy(),
      });
    }
    this.inputLocked = false;
    this.input.keyboard?.resetKeys();
    this.interactions.setEnabled(!this.paused);
    this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
  }

  private drawShadowOverlap(
    overlay: Phaser.GameObjects.Graphics,
    centerX: number,
  ): void {
    const shadows = [
      { x: centerX - 18, length: 76, color: 0x2e4440 },
      { x: centerX, length: 88, color: 0x39473f },
      { x: centerX + 18, length: 81, color: 0x2c414a },
    ];

    for (const shadow of shadows) {
      overlay.fillStyle(shadow.color, 0.58);
      overlay.beginPath();
      overlay.moveTo(shadow.x - 6, FUJI_GROUND_Y - 2);
      overlay.lineTo(shadow.x + shadow.length - 12, FUJI_GROUND_Y + 13);
      overlay.lineTo(shadow.x + shadow.length, FUJI_GROUND_Y + 18);
      overlay.lineTo(shadow.x + 10, FUJI_GROUND_Y);
      overlay.closePath();
      overlay.fillPath();
    }
    overlay.fillStyle(0x253b3b, 0.4);
    overlay.fillRect(centerX - 20, FUJI_GROUND_Y + 5, 82, 4);
    overlay.fillStyle(0xe9b97e, 0.2);
    overlay.fillRect(centerX - 14, FUJI_GROUND_Y + 10, 67, 2);
  }

  private scheduleEventStep(delayMs: number, callback: () => void): void {
    const timer = this.time.delayedCall(delayMs, callback);
    this.eventTimers.push(timer);
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
    const controls = this.add
      .text(
        GAME_WIDTH / 2,
        170,
        'A/D 或 ←/→ 移动    E 互动',
        {
          fontFamily: PIXEL_FONT_FAMILY,
          fontSize: '10px',
          color: '#7f96b9',
          resolution: 1,
        },
      )
      .setOrigin(0.5);

    this.pauseOverlay = this.add
      .container(0, 0, [shade, title, hint, controls])
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

  private handleWake(): void {
    this.inputLocked = false;
    this.paused = false;
    this.pauseOverlay.setVisible(false);
    this.dialogue.hide();
    this.car.hideWindowReflection();
    this.male.setPose('idle');
    this.female.setPose('idle');
    this.firstActItem?.destroy();
    this.firstActItem = undefined;
    this.interactions.setTargetEnabled(
      'car-window',
      !this.storyDirector.isCompleted('car-window-reflection'),
    );
    this.interactions.setTargetEnabled(
      'flower-window',
      !this.storyDirector.isCompleted('flower-window-memory'),
    );
    if (this.storyDirector.isCompleted('flower-window-memory')) {
      this.flowerShop.restoreCompletedState();
    }
    this.interactions.setEnabled(true);
    this.input.keyboard?.resetKeys();
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.traveler, true, 0.12, 0.12);
  }
}
