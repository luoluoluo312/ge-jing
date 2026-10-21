import Phaser from 'phaser';

import { PIXEL_FONT_FAMILY } from '../ui/pixelFont';

export const FUJI_WORLD_WIDTH = 6500;
export const FUJI_GROUND_Y = 238;

export function createFujiBackdrop(scene: Phaser.Scene): void {
  createFujiFarLandscape(scene);

  const street = scene.add.graphics().setDepth(-10);
  street.fillStyle(0x111c31);
  street.fillRect(0, 205, FUJI_WORLD_WIDTH, 36);
  street.fillStyle(0x263851, 0.8);
  street.fillRect(0, 235, FUJI_WORLD_WIDTH, 4);
  street.fillStyle(0x0a1527);
  street.fillRect(0, FUJI_GROUND_Y, FUJI_WORLD_WIDTH, 32);
  street.fillStyle(0x172943);
  for (let x = 0; x < FUJI_WORLD_WIDTH; x += 94) {
    street.fillRect(x, 248, 47, 2);
  }

  drawConvenienceStore(scene);
  drawStreetLamp(scene, 225);
  drawStreetLamp(scene, 690);
  drawUtilityPole(scene, 622);
  drawUmbrella(scene);

  drawLampGroundReflection(street, 225);
  drawLampGroundReflection(street, 690);
  street.fillStyle(0x74a6c5, 0.07);
  street.fillRect(258, 245, 96, 4);
  street.fillRect(271, 251, 61, 5);
  street.fillRect(287, 258, 31, 3);

}

type FujiFarLandscapeOptions = {
  skyWidth?: number;
  cityWidth?: number;
  mountainOffsetX?: number;
};

export function createFujiFarLandscape(
  scene: Phaser.Scene,
  {
    skyWidth = 480,
    cityWidth = 960,
    mountainOffsetX = -30,
  }: FujiFarLandscapeOptions = {},
): void {
  scene.add
    .rectangle(240, 135, 480, 270, 0x07142a)
    .setScrollFactor(0)
    .setDepth(-40);

  const skyBands = scene.add.graphics().setScrollFactor(0).setDepth(-38);
  skyBands.fillStyle(0x0d2240);
  skyBands.fillRect(0, 0, skyWidth, 92);
  skyBands.fillStyle(0x102a4a);
  skyBands.fillRect(0, 92, skyWidth, 70);

  const moon = scene.add.graphics().setScrollFactor(0.05).setDepth(-36);
  moon.fillStyle(0xe5e2d3, 0.9);
  moon.fillCircle(92, 48, 17);
  moon.fillStyle(0x0d2240, 1);
  moon.fillCircle(101, 44, 16);
  moon.fillStyle(0xf5f1df, 0.72);
  moon.fillRect(82, 39, 3, 2);
  moon.fillRect(87, 55, 2, 2);

  const mountain = scene.add.graphics().setScrollFactor(0.08).setDepth(-35);
  mountain.setPosition(mountainOffsetX, 0);
  drawFujiMountain(mountain);

  const distantCity = scene.add.graphics().setScrollFactor(0.3).setDepth(-25);
  distantCity.fillStyle(0x10223b);
  for (let x = -20; x < cityWidth; x += 44) {
    const height = 18 + ((x / 44) % 4) * 7;
    distantCity.fillRect(x, 205 - height, 38, height);
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        if ((x / 44 + row + column) % 3 === 0) {
          distantCity.fillStyle(0x48627a);
        } else {
          distantCity.fillStyle(0x263b50);
        }
        distantCity.fillRect(
          x + 7 + column * 9,
          198 - height + row * 8,
          4,
          3,
        );
      }
    }
    distantCity.fillStyle(0x10223b);
  }
  for (let x = 4; x < cityWidth; x += 37) {
    distantCity.fillStyle(x % 3 === 0 ? 0xd9984f : 0x5f86a2);
    distantCity.fillRect(x, 181 + (x % 4) * 5, 2, 2);
  }

  // A low-opacity foothill sits above the city line so the mountain anchors the horizon.
  const foothill = scene.add.graphics().setScrollFactor(0.08).setDepth(-24);
  foothill.setPosition(mountainOffsetX, 0);
  foothill.fillStyle(0x2a4a65, 0.24);
  foothill.beginPath();
  foothill.moveTo(-60, 196);
  foothill.lineTo(40, 192);
  foothill.lineTo(142, 187);
  foothill.lineTo(240, 181);
  foothill.lineTo(330, 177);
  foothill.lineTo(420, 181);
  foothill.lineTo(520, 188);
  foothill.lineTo(620, 196);
  foothill.closePath();
  foothill.fillPath();
  foothill.fillStyle(0x10253d, 0.15);
  foothill.fillRect(26, 189, 540, 7);

  const footHaze = scene.add.graphics().setScrollFactor(0.24).setDepth(-24);
  for (let x = -24; x < cityWidth; x += 238) {
    footHaze.fillStyle(0x0b1c31, 0.12);
    footHaze.fillRect(x, 169, 176, 7);
    footHaze.fillRect(x + 160, 175, 126, 7);
    footHaze.fillStyle(0x08172a, 0.18);
    footHaze.fillRect(x + 84, 182, 136, 7);
    footHaze.fillRect(x + 218, 188, 162, 6);
  }
}

export function createControlHint(
  scene: Phaser.Scene,
  interactionLabel = '观察',
): void {
  scene.add
    .text(240, 11, `A/D 或 ←/→ 移动   E ${interactionLabel}   Esc 暂停`, {
      fontFamily: PIXEL_FONT_FAMILY,
      fontSize: '10px',
      color: '#d2c9b9',
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
    .setOrigin(0.5, 0)
    .setScrollFactor(0)
    .setDepth(90)
    .setAlpha(0.82);
}

function drawConvenienceStore(scene: Phaser.Scene): void {
  const store = scene.add.graphics().setDepth(-2);
  store.fillStyle(0x171b2b);
  store.fillRect(16, 145, 139, 84);
  store.fillStyle(0x25243a);
  store.fillRect(10, 139, 151, 9);
  store.fillStyle(0x111726);
  store.fillRect(22, 155, 126, 17);
  store.fillStyle(0xba654e);
  store.fillRect(18, 174, 137, 6);
  store.fillStyle(0xe7c276);
  store.fillRect(31, 184, 101, 40);
  store.fillStyle(0x5e7c8c);
  store.fillRect(49, 185, 2, 39);
  store.fillRect(91, 185, 2, 39);
  store.fillStyle(0x20304a);
  store.fillRect(95, 181, 41, 47);
  store.fillStyle(0xc98c55);
  store.fillRect(110, 188, 17, 39);
  store.fillStyle(0xf2d58d);
  store.fillRect(21, 187, 4, 21);
  store.fillStyle(0x262d42);
  store.fillRect(13, 231, 144, 7);

  for (let x = 33; x < 92; x += 12) {
    store.fillStyle(x % 24 === 9 ? 0xa94f52 : 0x657954);
    store.fillRect(x, 201, 7, 10);
    store.fillStyle(0x2f3b49);
    store.fillRect(x, 211, 7, 2);
  }

  scene.add
    .text(89, 158, '便 利 店', {
      fontFamily: PIXEL_FONT_FAMILY,
      fontSize: '10px',
      color: '#f3d995',
      resolution: 1,
    })
    .setOrigin(0.5)
    .setDepth(0);
}

export function drawStreetLamp(scene: Phaser.Scene, x: number): void {
  const lamp = scene.add.graphics().setDepth(1);
  lamp.fillStyle(0x0a111c);
  lamp.fillRect(x, 147, 4, 91);
  lamp.fillRect(x - 8, 146, 12, 4);
  lamp.fillStyle(0xb9874f);
  lamp.fillRect(x - 7, 139, 10, 7);

  lamp.fillStyle(0xffd581, 0.05);
  lamp.fillRect(x - 13, 132, 26, 13);
  lamp.fillStyle(0xffdb8d, 0.09);
  lamp.fillRect(x - 8, 135, 16, 10);
  lamp.fillStyle(0xffe3a1, 0.15);
  lamp.fillRect(x - 4, 137, 11, 7);
  lamp.fillStyle(0xffe7ae, 0.85);
  lamp.fillRect(x - 4, 136, 3, 3);
}

function drawUtilityPole(scene: Phaser.Scene, x: number): void {
  const pole = scene.add.graphics().setScrollFactor(1.04).setDepth(75);
  pole.fillStyle(0x070b12);
  pole.fillRect(x, 75, 5, 163);
  pole.fillRect(x - 18, 84, 42, 3);
  pole.fillRect(x - 10, 74, 26, 2);
}

export function drawFujiMountain(g: Phaser.GameObjects.Graphics): void {
  const fillPolygon = (
    points: ReadonlyArray<readonly [number, number]>,
    color: number,
    alpha = 1,
  ): void => {
    g.fillStyle(color, alpha);
    g.beginPath();
    g.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length; index += 1) {
      g.lineTo(points[index][0], points[index][1]);
    }
    g.closePath();
    g.fillPath();
  };

  const outline: ReadonlyArray<readonly [number, number]> = [
    [-90, 196],
    [-28, 193],
    [24, 191],
    [68, 187],
    [108, 181],
    [145, 173],
    [178, 163],
    [207, 151],
    [231, 137],
    [251, 121],
    [268, 105],
    [279, 91],
    [284, 80],
    [289, 65],
    [294, 63],
    [312, 62],
    [317, 68],
    [322, 77],
    [328, 90],
    [338, 104],
    [350, 118],
    [364, 132],
    [380, 145],
    [400, 155],
    [424, 164],
    [451, 172],
    [481, 179],
    [516, 185],
    [558, 190],
    [610, 194],
    [690, 196],
  ];

  fillPolygon(outline, 0x31536d);

  fillPolygon(
    [
      [294, 63],
      [289, 65],
      [284, 80],
      [279, 91],
      [268, 105],
      [251, 121],
      [231, 137],
      [207, 151],
      [178, 163],
      [145, 173],
      [108, 181],
      [68, 187],
      [24, 191],
      [-28, 193],
      [-90, 196],
      [188, 196],
      [238, 174],
      [270, 142],
      [287, 109],
      [294, 84],
    ],
    0x436a82,
  );

  fillPolygon(
    [
      [294, 63],
      [312, 62],
      [317, 68],
      [322, 77],
      [328, 90],
      [338, 104],
      [350, 118],
      [364, 132],
      [380, 145],
      [400, 155],
      [424, 164],
      [451, 172],
      [481, 179],
      [516, 185],
      [558, 190],
      [610, 194],
      [690, 196],
      [430, 196],
      [382, 172],
      [348, 143],
      [324, 112],
      [310, 88],
    ],
    0x223e59,
  );

  const snowLight: ReadonlyArray<readonly [number, number]> = [
    [289, 65],
    [294, 63],
    [312, 62],
    [317, 68],
    [322, 77],
    [328, 90],
    [338, 104],
    [345, 112],
    [335, 108],
    [338, 116],
    [327, 112],
    [320, 121],
    [310, 113],
    [301, 121],
    [293, 112],
    [284, 118],
    [276, 107],
    [267, 105],
    [273, 92],
    [282, 79],
  ];
  fillPolygon(snowLight, 0xbacdda);

  fillPolygon(
    [
      [294, 63],
      [312, 62],
      [317, 68],
      [322, 77],
      [328, 90],
      [338, 104],
      [345, 112],
      [335, 108],
      [338, 116],
      [327, 112],
      [320, 121],
      [310, 113],
      [301, 121],
      [294, 107],
      [294, 84],
      [299, 72],
    ],
    0x8faabd,
  );

  // Short vertical snow gullies break up the dark face without changing the silhouette.
  g.fillStyle(0xb4c8d5, 0.42);
  g.fillRect(281, 101, 2, 9);
  g.fillRect(290, 106, 2, 13);
  g.fillRect(303, 105, 2, 10);
  g.fillRect(316, 106, 2, 8);
  g.fillStyle(0xdde7ed, 0.55);
  g.fillRect(287, 77, 2, 4);
  g.fillRect(299, 74, 2, 5);
  g.fillRect(309, 80, 2, 3);

  g.lineStyle(1, 0x6c8da2, 0.68);
  g.beginPath();
  g.moveTo(outline[0][0], outline[0][1]);
  for (let index = 1; index < outline.length; index += 1) {
    g.lineTo(outline[index][0], outline[index][1]);
  }
  g.strokePath();

  // Sparse facets retain a coarse pixel texture without filling the face with noise.
  g.fillStyle(0x587e94, 0.5);
  g.fillRect(93, 181, 15, 2);
  g.fillRect(151, 169, 12, 2);
  g.fillRect(211, 147, 9, 2);
  g.fillRect(253, 118, 6, 2);
  g.fillRect(274, 95, 4, 2);
  g.fillRect(361, 131, 11, 2);
  g.fillRect(422, 160, 14, 2);
  g.fillRect(512, 184, 12, 2);
  g.fillStyle(0x162d47, 0.58);
  g.fillRect(39, 191, 20, 2);
  g.fillRect(326, 110, 9, 2);
  g.fillRect(397, 154, 15, 2);
  g.fillRect(486, 181, 14, 2);

  // Stepped haze merges the lowest slopes into the city without crossing the summit.
  g.fillStyle(0x0c2038, 0.1);
  g.fillRect(-40, 180, 102, 4);
  g.fillRect(92, 181, 106, 4);
  g.fillRect(400, 178, 112, 4);
  g.fillStyle(0x0a1b30, 0.16);
  g.fillRect(-54, 187, 118, 5);
  g.fillRect(88, 188, 124, 5);
  g.fillRect(374, 185, 124, 5);
  g.fillRect(522, 189, 132, 5);
  g.fillStyle(0x08172a, 0.26);
  g.fillRect(-72, 193, 148, 4);
  g.fillRect(118, 193, 128, 4);
  g.fillRect(412, 192, 142, 4);
  g.fillRect(566, 192, 118, 4);
}

export function drawLampGroundReflection(
  g: Phaser.GameObjects.Graphics,
  x: number,
): void {
  g.fillStyle(0x6f8791, 0.1);
  g.fillRect(x - 31, 239, 62, 4);
  g.fillRect(x - 22, 244, 45, 4);
  g.fillRect(x - 14, 249, 31, 5);
  g.fillStyle(0xd7a955, 0.11);
  g.fillRect(x - 20, 242, 39, 3);
  g.fillRect(x - 11, 247, 23, 4);
  g.fillRect(x - 7, 253, 15, 5);
  g.fillStyle(0xf1c86f, 0.16);
  g.fillRect(x - 12, 240, 23, 3);
  g.fillRect(x - 5, 245, 11, 5);
  g.fillRect(x + 3, 252, 5, 6);
  g.fillRect(x - 3, 260, 9, 4);
  g.fillStyle(0xffdfa0, 0.2);
  g.fillRect(x - 2, 239, 5, 4);
  g.fillRect(x + 3, 245, 3, 5);
  g.fillRect(x - 1, 251, 4, 6);
}

function drawUmbrella(scene: Phaser.Scene): void {
  const umbrella = scene.add.graphics().setDepth(8);
  umbrella.fillStyle(0x17233b);
  umbrella.beginPath();
  umbrella.moveTo(412, 177);
  umbrella.lineTo(429, 160);
  umbrella.lineTo(455, 153);
  umbrella.lineTo(480, 158);
  umbrella.lineTo(496, 177);
  umbrella.lineTo(485, 173);
  umbrella.lineTo(475, 179);
  umbrella.lineTo(465, 173);
  umbrella.lineTo(453, 180);
  umbrella.lineTo(442, 173);
  umbrella.lineTo(430, 180);
  umbrella.lineTo(420, 174);
  umbrella.closePath();
  umbrella.fillPath();
  umbrella.fillStyle(0x314967);
  umbrella.fillRect(430, 160, 44, 2);
  umbrella.fillRect(447, 155, 24, 2);
  umbrella.fillStyle(0x101a2c);
  umbrella.fillRect(434, 178, 3, 15);
  umbrella.fillRect(431, 191, 3, 16);
  umbrella.fillRect(428, 205, 3, 13);
  umbrella.fillRect(425, 216, 9, 3);
}
