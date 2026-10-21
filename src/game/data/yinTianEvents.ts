import type { StoryEvent } from './storyEvent';

type YinTianVisualEffect =
  | 'cigarette-smoke'
  | 'photo-memory'
  | 'room2-memory'
  | 'wedding-window'
  | 'object-inspection';

export const YIN_TIAN_EVENTS: readonly StoryEvent<YinTianVisualEffect>[] = [
  {
    id: 'room1-cigarette',
    zone: { minX: 94, maxX: 130 },
    trigger: { type: 'interaction', targetId: 'room1-cigarette' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 240, focusY: 135, durationMs: 0 },
    visualEffect: { type: 'cigarette-smoke', durationMs: 3000 },
    completionFlag: 'yintian.room1.cigarette.completed',
  },
  {
    id: 'room1-photo',
    zone: { minX: 153, maxX: 197 },
    trigger: { type: 'interaction', targetId: 'room1-photo' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 174, focusY: 195, durationMs: 650 },
    visualEffect: { type: 'photo-memory', durationMs: 4000 },
    completionFlag: 'yintian.room1.photo.completed',
  },
  {
    id: 'room2-tie',
    zone: { minX: 672, maxX: 728 },
    trigger: { type: 'interaction', targetId: 'room2-tie' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 700, focusY: 230, durationMs: 0 },
    caption: '除了那一点点倦。',
    visualEffect: { type: 'object-inspection', durationMs: 3000 },
    completionFlag: 'yintian.room2.tie.completed',
  },
  {
    id: 'room2-heels',
    zone: { minX: 1007, maxX: 1063 },
    trigger: { type: 'interaction', targetId: 'room2-heels' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 1035, focusY: 230, durationMs: 0 },
    caption: '谁去捡？',
    visualEffect: { type: 'object-inspection', durationMs: 3000 },
    completionFlag: 'yintian.room2.heels.completed',
  },
  {
    id: 'room2-wine',
    zone: { minX: 1075, maxX: 1125 },
    trigger: { type: 'interaction', targetId: 'room2-wine' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 1080, focusY: 240, durationMs: 0 },
    caption: '覆水难收。',
    visualEffect: { type: 'object-inspection', durationMs: 3000 },
    completionFlag: 'yintian.room2.wine.completed',
  },
  {
    id: 'room2-torn-photo',
    zone: { minX: 852, maxX: 908 },
    trigger: { type: 'interaction', targetId: 'room2-torn-photo' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 880, focusY: 245, durationMs: 0 },
    caption: '那几年，感性赢了理性。',
    visualEffect: { type: 'object-inspection', durationMs: 3000 },
    completionFlag: 'yintian.room2.tornPhoto.completed',
  },
  {
    id: 'room2-memory',
    zone: { minX: 878, maxX: 932 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 900, focusY: 142, durationMs: 650 },
    narrationLines: [
      '开始总是分分钟都妙不可言。',
      '谁都以为热情它永不会减。',
      '除了激情褪去后的那一点点倦。',
    ],
    visualEffect: { type: 'room2-memory', durationMs: 7200 },
    completionFlag: 'yintian.room2.memory.completed',
  },
  {
    id: 'room3-wedding-window',
    zone: { minX: 1598, maxX: 1640 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 1760, focusY: 145, durationMs: 1700 },
    narrationLines: [
      '回想那一天，喧闹的喜宴。',
      '总之那几年，你们两个没有缘。',
    ],
    visualEffect: { type: 'wedding-window', durationMs: 15400 },
    completionFlag: 'yintian.room3.weddingWindow.completed',
  },
];
