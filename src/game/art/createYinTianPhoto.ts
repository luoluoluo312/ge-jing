import Phaser from 'phaser';

export const YIN_TIAN_PHOTO_TEXTURE = 'yintian-photo-32';

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
