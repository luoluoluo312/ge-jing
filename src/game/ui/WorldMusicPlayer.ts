import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from './pixelFont';

const PLAYER_X = 8;
const PLAYER_Y = 8;
const TRACK_X = 8;
const TRACK_Y = 27;
const TRACK_WIDTH = 96;
const TRACK_HEIGHT = 3;

export class WorldMusicPlayer extends Phaser.GameObjects.Container {
  private readonly iconText: Phaser.GameObjects.Text;
  private readonly progressFill: Phaser.GameObjects.Rectangle;
  private audio?: HTMLAudioElement;
  private playing = false;
  private loading = false;
  private unavailable = false;
  private dragging = false;
  private pressStartedOnPlayer = false;
  private progress = 0;
  private pendingSeekProgress?: number;

  constructor(
    scene: Phaser.Scene,
    title: string,
    private readonly audioPath: string,
  ) {
    const background = scene.add
      .rectangle(0, 0, 112, 36, 0x080d18, 0.78)
      .setOrigin(0)
      .setStrokeStyle(1, 0x52647a, 0.72);
    const icon = scene.add
      .text(9, 11, '▶', {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '11px',
        color: '#d9e3ec',
        resolution: 1,
      })
      .setOrigin(0, 0.5);
    const label = scene.add
      .text(27, 11, title, {
        fontFamily: PIXEL_FONT_FAMILY,
        fontSize: '9px',
        color: '#c6d0da',
        resolution: 1,
      })
      .setOrigin(0, 0.5);
    const track = scene.add
      .rectangle(
        TRACK_X,
        TRACK_Y,
        TRACK_WIDTH,
        TRACK_HEIGHT,
        0x303945,
        0.95,
      )
      .setOrigin(0, 0.5);
    const progressFill = scene.add
      .rectangle(
        TRACK_X,
        TRACK_Y,
        TRACK_WIDTH,
        TRACK_HEIGHT,
        0xd7e3e8,
        1,
      )
      .setOrigin(0, 0.5)
      .setScale(0, 1);

    super(scene, PLAYER_X, PLAYER_Y, [
      background,
      track,
      progressFill,
      icon,
      label,
    ]);
    this.iconText = icon;
    this.progressFill = progressFill;
    this.setScrollFactor(0);
    this.setDepth(88);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 112, 36),
      Phaser.Geom.Rectangle.Contains,
    );
    scene.add.existing(this);

    this.on(
      Phaser.Input.Events.POINTER_DOWN,
      (
        pointer: Phaser.Input.Pointer,
        _localX: number,
        localY: number,
      ) => {
        if (localY >= TRACK_Y - 5 && localY <= TRACK_Y + 6) {
          this.dragging = true;
          if (this.audio && this.playing) {
            this.audio.pause();
          }
          this.seekFromPointer(pointer);
          return;
        }
        this.pressStartedOnPlayer = true;
      },
    );
    scene.input.on(
      Phaser.Input.Events.POINTER_MOVE,
      this.handlePointerMove,
      this,
    );
    scene.input.on(
      Phaser.Input.Events.POINTER_UP,
      this.handlePointerUp,
      this,
    );
    scene.events.on(
      Phaser.Scenes.Events.UPDATE,
      this.updatePlaybackState,
      this,
    );
    scene.events.on(Phaser.Scenes.Events.SLEEP, this.pauseAudio, this);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.dragging) {
      return;
    }
    this.seekFromPointer(pointer);
  }

  private handlePointerUp(): void {
    if (this.dragging) {
      this.dragging = false;
      this.commitSeek();
      return;
    }
    if (!this.pressStartedOnPlayer) {
      return;
    }

    this.pressStartedOnPlayer = false;
    this.playing = !this.playing;
    this.iconText.setText(this.playing ? '⏸' : '▶');
    if (this.playing) {
      void this.playAudio();
    } else {
      this.pauseAudio();
    }
  }

  private seekFromPointer(pointer: Phaser.Input.Pointer): void {
    const trackScreenX = PLAYER_X + TRACK_X;
    this.progress = Phaser.Math.Clamp(
      (pointer.x - trackScreenX) / TRACK_WIDTH,
      0,
      1,
    );
    this.progressFill.setScale(this.progress, 1);
  }

  private commitSeek(): void {
    if (!this.audio) {
      return;
    }
    const duration = this.audio.duration;
    if (Number.isFinite(duration) && duration > 0) {
      this.audio.currentTime = this.progress * duration;
      this.pendingSeekProgress = undefined;
    } else {
      this.pendingSeekProgress = this.progress;
    }
    if (this.playing) {
      void this.playAudio();
    }
  }

  private updatePlaybackState(): void {
    this.syncLayout();
    if (
      !this.dragging &&
      this.audio &&
      Number.isFinite(this.audio.duration) &&
      this.audio.duration > 0
    ) {
      this.progress = Phaser.Math.Clamp(
        this.audio.currentTime / this.audio.duration,
        0,
        1,
      );
      this.progressFill.setScale(this.progress, 1);
    }
  }

  private syncLayout(): void {
    const zoom = this.scene.cameras.main.zoom;
    this.setScale(1 / zoom);
    this.setPosition(
      240 - (240 - PLAYER_X) / zoom,
      135 - (135 - PLAYER_Y) / zoom,
    );
  }

  private async playAudio(): Promise<void> {
    if (this.loading || this.unavailable) {
      return;
    }

    if (!this.audio) {
      this.loading = true;
      try {
        const response = await fetch(this.audioPath, { method: 'HEAD' });
        if (!response.ok) {
          this.unavailable = true;
          return;
        }
        const audio = new Audio(this.audioPath);
        audio.loop = true;
        audio.preload = 'auto';
        audio.addEventListener('loadedmetadata', () => {
          if (
            this.pendingSeekProgress !== undefined &&
            Number.isFinite(audio.duration) &&
            audio.duration > 0
          ) {
            audio.currentTime = this.pendingSeekProgress * audio.duration;
            this.pendingSeekProgress = undefined;
          }
        });
        this.audio = audio;
      } catch {
        this.unavailable = true;
        return;
      } finally {
        this.loading = false;
      }
    }

    if (!this.playing || !this.audio) {
      return;
    }
    try {
      await this.audio.play();
    } catch {
      // Keep the placeholder state usable while the audio asset is absent.
    }
  }

  private pauseAudio(): void {
    this.playing = false;
    this.iconText.setText('▶');
    this.audio?.pause();
  }
}
