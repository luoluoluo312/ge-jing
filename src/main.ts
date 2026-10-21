import Phaser from 'phaser';

import { BootScene } from './game/scenes/BootScene';
import { FujiScene } from './game/scenes/FujiScene';
import { HubScene } from './game/scenes/HubScene';
import { TitleScene } from './game/scenes/TitleScene';

const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;

const startGame = (): void => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#071225',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    scene: [BootScene, TitleScene, HubScene, FujiScene],
  });
};

document.fonts
  .load('10px "Fusion Pixel"', '富士山入口暂停继续')
  .then(startGame)
  .catch((error: unknown) => {
    console.warn('Pixel font failed to load; using fallback.', error);
    startGame();
  });
