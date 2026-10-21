import Phaser from 'phaser';

export type NpcKind = 'male' | 'female';
export type NpcPose =
  | 'idle'
  | 'concern'
  | 'collar'
  | 'offer'
  | 'receive'
  | 'smoke';

export class NPC extends Phaser.GameObjects.Container {
  private readonly art: Phaser.GameObjects.Graphics;
  private idleElapsed = 0;
  private pose: NpcPose = 'idle';
  private coatWorn: boolean;
  private sitting = false;
  private wetShoulder = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private readonly kind: NpcKind,
    private readonly facing: -1 | 1,
  ) {
    super(scene, x, y);
    this.coatWorn = kind === 'male';
    this.art = new Phaser.GameObjects.Graphics(scene);
    this.add(this.art);
    this.setDepth(7);
    this.setScale(facing, 1);
    this.redraw();
    scene.add.existing(this);
  }

  setPose(pose: NpcPose): this {
    this.pose = pose;
    this.redraw();
    return this;
  }

  setFacing(facing: -1 | 1): this {
    this.setScale(facing, 1);
    return this;
  }

  setCoatWorn(worn: boolean): this {
    this.coatWorn = worn;
    this.redraw();
    return this;
  }

  setSitting(sitting: boolean): this {
    this.sitting = sitting;
    this.redraw();
    return this;
  }

  setWetShoulder(wet: boolean): this {
    this.wetShoulder = wet;
    this.redraw();
    return this;
  }

  updateIdle(delta: number): void {
    this.idleElapsed += delta;
    this.redraw();
  }

  private redraw(): void {
    const bob = Math.floor(this.idleElapsed / 700) % 2 === 0 ? 0 : -1;
    this.art.clear();
    this.art.fillStyle(0x050b16, 0.6);
    this.art.fillRect(-9, -1, 18, 3);

    if (this.sitting) {
      this.drawSitting();
      return;
    }

    if (this.kind === 'male') {
      this.drawMale(bob);
    } else {
      this.drawFemale(bob);
    }
  }

  private drawMale(bob: number): void {
    const concern = this.pose === 'concern';
    const collar = this.pose === 'collar';
    const offer = this.pose === 'offer';

    this.art.fillStyle(0x17151b);
    this.art.fillRect(-6, -9, 5, 9);
    this.art.fillRect(2, -9, 5, 9);

    this.art.fillStyle(this.coatWorn ? 0x2e2930 : 0xb9b2a6);
    this.art.fillRect(-8, -31 + bob, 16, 21);
    this.art.fillRect(-9, -28 + bob, 3, 14);
    this.art.fillRect(7, -28 + bob, 3, 14);
    this.art.fillStyle(this.coatWorn ? 0x48404a : 0xe1dacb);
    this.art.fillRect(-7, -30 + bob, 14, 18);
    this.art.fillStyle(this.coatWorn ? 0x6c5c52 : 0xa99c87);
    this.art.fillRect(-4, -30 + bob, 7, 3);
    this.art.fillRect(-1, -28 + bob, 3, 12);
    if (this.coatWorn) {
      this.art.fillStyle(0x17151b);
      this.art.fillRect(-8, -15 + bob, 16, 3);
      this.art.fillRect(-1, -15 + bob, 3, 3);
    }
    this.art.fillStyle(this.coatWorn ? 0x5a4b45 : 0xc8c0b0);
    this.art.fillRect(-8, -11 + bob, 4, 9);
    this.art.fillRect(5, -11 + bob, 4, 9);
    if (this.wetShoulder) {
      this.art.fillStyle(0x20242e);
      this.art.fillRect(4, -29 + bob, 4, 4);
      this.art.fillRect(6, -25 + bob, 2, 5);
    }

    if (collar) {
      this.art.fillStyle(0xb79b83);
      this.art.fillRect(2, -31 + bob, 3, 3);
      this.art.fillRect(4, -28 + bob, 2, 5);
    } else if (offer) {
      this.art.fillStyle(this.coatWorn ? 0x48404a : 0xc9c0af);
      this.art.fillRect(7, -27 + bob, 13, 3);
      this.art.fillStyle(0xd2b089);
      this.art.fillRect(18, -28 + bob, 3, 3);
    } else if (concern) {
      this.art.fillStyle(this.coatWorn ? 0x48404a : 0xc9c0af);
      this.art.fillRect(7, -27 + bob, 8, 3);
      this.art.fillStyle(0xd2b089);
      this.art.fillRect(14, -28 + bob, 3, 3);
    } else if (this.pose === 'smoke') {
      this.art.fillStyle(0x48404a);
      this.art.fillRect(7, -29 + bob, 4, 3);
      this.art.fillRect(9, -32 + bob, 3, 4);
      this.art.fillStyle(0xd2b089);
      this.art.fillRect(10, -33 + bob, 3, 3);
      this.art.fillStyle(0xd8d2c3);
      this.art.fillRect(13, -32 + bob, 6, 1);
      this.art.fillStyle(0xf07945);
      this.art.fillRect(19, -33 + bob, 2, 2);
    }

    this.art.fillStyle(0xd5b28b);
    this.art.fillRect(-5, -36 + bob, 10, 7);
    this.art.fillStyle(0x15151d);
    this.art.fillRect(-7, -37 + bob, 14, 4);
    this.art.fillRect(-7, -35 + bob, 3, 6);
    this.art.fillRect(4, -35 + bob, 3, 4);
  }

  private drawFemale(bob: number): void {
    this.art.fillStyle(0x17151b);
    this.art.fillRect(-5, -8, 4, 8);
    this.art.fillRect(2, -8, 4, 8);

    this.art.fillStyle(0xb89d89);
    this.art.fillRect(-7, -30 + bob, 14, 22);
    this.art.fillRect(-8, -25 + bob, 3, 13);
    this.art.fillRect(6, -25 + bob, 3, 13);
    this.art.fillStyle(0xd1b8a0);
    this.art.fillRect(-6, -29 + bob, 12, 18);
    this.art.fillStyle(0x7e6559);
    this.art.fillRect(-1, -29 + bob, 3, 13);
    if (this.coatWorn) {
      this.art.fillStyle(0x2e2930);
      this.art.fillRect(-9, -31 + bob, 18, 21);
      this.art.fillRect(-10, -28 + bob, 3, 15);
      this.art.fillRect(7, -28 + bob, 3, 15);
      this.art.fillStyle(0x48404a);
      this.art.fillRect(-7, -30 + bob, 14, 18);
      this.art.fillStyle(0x6c5c52);
      this.art.fillRect(-4, -30 + bob, 7, 3);
      this.art.fillRect(-1, -28 + bob, 3, 12);
    }
    this.art.fillStyle(0x4d3b36);
    this.art.fillRect(-8, -10 + bob, 5, 9);
    this.art.fillRect(5, -10 + bob, 5, 9);
    this.art.fillStyle(0xa17c66);
    this.art.fillRect(8, -26 + bob, 4, 9);

    this.art.fillStyle(0xd9b992);
    this.art.fillRect(-4, -35 + bob, 9, 7);
    this.art.fillStyle(0x392a28);
    this.art.fillRect(-6, -37 + bob, 12, 5);
    this.art.fillRect(-7, -34 + bob, 3, 10);
    this.art.fillRect(4, -34 + bob, 3, 7);

    if (this.pose === 'receive') {
      this.art.fillStyle(0x6c5c52);
      this.art.fillRect(5, -27 + bob, 11, 3);
      this.art.fillStyle(0xd9b992);
      this.art.fillRect(15, -28 + bob, 3, 3);
    }
  }

  private drawSitting(): void {
    if (this.kind === 'male') {
      this.art.fillStyle(0x17151b);
      this.art.fillRect(-9, -10, 7, 10);
      this.art.fillRect(4, -10, 17, 5);
      this.art.fillStyle(this.coatWorn ? 0x48404a : 0xe1dacb);
      this.art.fillRect(-7, -28, 15, 18);
      this.art.fillStyle(this.coatWorn ? 0x2e2930 : 0xb9b2a6);
      this.art.fillRect(-8, -29, 3, 16);
      this.art.fillRect(6, -29, 3, 16);
      this.art.fillStyle(0xd5b28b);
      this.art.fillRect(-4, -36, 9, 7);
      this.art.fillStyle(0x15151d);
      this.art.fillRect(-6, -37, 12, 4);
    } else {
      this.art.fillStyle(0x17151b);
      this.art.fillRect(-7, -10, 6, 10);
      this.art.fillRect(3, -10, 16, 5);
      this.art.fillStyle(0xd1b8a0);
      this.art.fillRect(-6, -28, 13, 18);
      this.art.fillStyle(0xb89d89);
      this.art.fillRect(-7, -29, 3, 16);
      this.art.fillRect(6, -29, 3, 16);
      if (this.coatWorn) {
        this.art.fillStyle(0x2e2930);
        this.art.fillRect(-8, -29, 16, 18);
        this.art.fillRect(-9, -27, 3, 15);
        this.art.fillRect(6, -27, 3, 15);
        this.art.fillStyle(0x48404a);
        this.art.fillRect(-6, -28, 13, 16);
        this.art.fillStyle(0x6c5c52);
        this.art.fillRect(-3, -28, 6, 3);
        this.art.fillRect(0, -25, 2, 10);
      }
      this.art.fillStyle(0xd9b992);
      this.art.fillRect(-4, -35, 9, 7);
      this.art.fillStyle(0x392a28);
      this.art.fillRect(-6, -37, 12, 5);
    }
  }
}
