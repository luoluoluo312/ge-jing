import Phaser from 'phaser';

export const YIN_TIAN_PHOTO_TEXTURE = 'yintian-photo-32';
export const YIN_TIAN_TORN_PHOTO_LEFT = 'yintian-photo-torn-left';
export const YIN_TIAN_TORN_PHOTO_RIGHT = 'yintian-photo-torn-right';
const YIN_TIAN_PUZZLE_TEXTURES = [
  'yintian-photo-piece-0',
  'yintian-photo-piece-1',
  'yintian-photo-piece-2',
  'yintian-photo-piece-3',
] as const;

export function createYinTianPhotoTexture(scene: Phaser.Scene): string {
  if (scene.textures.exists(YIN_TIAN_PHOTO_TEXTURE)) {
    return YIN_TIAN_PHOTO_TEXTURE;
  }

  const source = scene.textures
    .get('couple-source')
    .getSourceImage() as CanvasImageSource & {
      width: number;
      height: number;
    };
  const texture = scene.textures.createCanvas(
    YIN_TIAN_PHOTO_TEXTURE,
    32,
    32,
  );
  if (!texture) {
    throw new Error('Could not create YinTian photo texture.');
  }

  const side = Math.min(source.width, source.height);
  const sourceX = Math.floor((source.width - side) / 2);
  const sourceY = Math.floor((source.height - side) / 2);
  const context = texture.context;
  context.imageSmoothingEnabled = false;
  context.drawImage(
    source,
    sourceX,
    sourceY,
    side,
    side,
    0,
    0,
    32,
    32,
  );
  texture.refresh();
  texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  return YIN_TIAN_PHOTO_TEXTURE;
}

export function createYinTianTornPhotoTextures(
  scene: Phaser.Scene,
): { left: string; right: string } {
  if (
    scene.textures.exists(YIN_TIAN_TORN_PHOTO_LEFT) &&
    scene.textures.exists(YIN_TIAN_TORN_PHOTO_RIGHT)
  ) {
    return {
      left: YIN_TIAN_TORN_PHOTO_LEFT,
      right: YIN_TIAN_TORN_PHOTO_RIGHT,
    };
  }

  const source = scene.textures
    .get('couple-source')
    .getSourceImage() as CanvasImageSource & {
      width: number;
      height: number;
    };
  const side = Math.min(source.width, source.height);
  const sourceX = Math.floor((source.width - side) / 2);
  const tear = [
    17, 16, 17, 18, 17, 16, 15, 16,
    17, 16, 15, 14, 15, 16, 15, 14,
    15, 16, 17, 16, 15, 16, 17, 18,
    17, 16, 15, 16, 15, 14, 15, 16,
  ];

  for (const sideName of ['left', 'right'] as const) {
    const key =
      sideName === 'left'
        ? YIN_TIAN_TORN_PHOTO_LEFT
        : YIN_TIAN_TORN_PHOTO_RIGHT;
    const texture = scene.textures.createCanvas(key, 32, 32);
    if (!texture) {
      throw new Error(`Could not create ${sideName} torn photo texture.`);
    }

    const context = texture.context;
    context.clearRect(0, 0, 32, 32);
    context.imageSmoothingEnabled = false;
    context.drawImage(
      source,
      sourceX,
      0,
      side,
      side,
      0,
      0,
      32,
      32,
    );
    context.globalCompositeOperation = 'destination-in';
    context.fillStyle = '#ffffff';
    for (let y = 0; y < 32; y += 1) {
      if (sideName === 'left') {
        context.fillRect(0, y, tear[y], 1);
      } else {
        context.fillRect(tear[y] + 1, y, 31 - tear[y], 1);
      }
    }
    context.globalCompositeOperation = 'source-over';
    texture.refresh();
    texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  return {
    left: YIN_TIAN_TORN_PHOTO_LEFT,
    right: YIN_TIAN_TORN_PHOTO_RIGHT,
  };
}

export function createYinTianPuzzleTextures(
  scene: Phaser.Scene,
): readonly string[] {
  if (YIN_TIAN_PUZZLE_TEXTURES.every((key) => scene.textures.exists(key))) {
    return YIN_TIAN_PUZZLE_TEXTURES;
  }

  const source = scene.textures
    .get('couple-source')
    .getSourceImage() as CanvasImageSource & {
      width: number;
      height: number;
    };
  const side = Math.min(source.width, source.height);
  const sourceX = Math.floor((source.width - side) / 2);
  const sourceY = Math.floor((source.height - side) / 2);

  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      const index = row * 2 + column;
      const texture = scene.textures.createCanvas(
        YIN_TIAN_PUZZLE_TEXTURES[index],
        16,
        16,
      );
      if (!texture) {
        throw new Error(`Could not create photo piece ${index}.`);
      }

      const context = texture.context;
      context.imageSmoothingEnabled = false;
      context.drawImage(
        source,
        sourceX + column * side / 2,
        sourceY + row * side / 2,
        side / 2,
        side / 2,
        0,
        0,
        16,
        16,
      );
      texture.refresh();
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  }

  return YIN_TIAN_PUZZLE_TEXTURES;
}
