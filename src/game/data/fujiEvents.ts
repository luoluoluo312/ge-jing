export type StoryEvent = {
  id: string;
  zone: { minX: number; maxX: number };
  trigger:
    | { type: 'interaction'; targetId: string }
    | { type: 'zone' };
  once: boolean;
  lockInput: boolean;
  cameraCue: { focusX: number; focusY: number; durationMs: number };
  dialogue?: { title: string; body: string; footer: string };
  visualEffect: {
    type:
      | 'window-reflection'
      | 'flower-memory'
      | 'shadow-overlap'
      | 'phone-call'
      | 'npc-distance'
      | 'memorial-stone'
      | 'coat-transfer'
      | 'finale';
    durationMs: number;
  };
  completionFlag: string;
};

export const FUJI_EVENTS: readonly StoryEvent[] = [
  {
    id: 'car-window-reflection',
    zone: { minX: 342, maxX: 424 },
    trigger: { type: 'interaction', targetId: 'car-window' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 376, focusY: 202, durationMs: 700 },
    dialogue: {
      title: '车窗旁',
      body: '男：“路上小心。”\n女：“嗯。”',
      footer: '短暂的重逢与告别',
    },
    visualEffect: { type: 'window-reflection', durationMs: 3000 },
    completionFlag: 'act1.carWindowReflection.completed',
  },
  {
    id: 'flower-window-memory',
    zone: { minX: 1160, maxX: 1320 },
    trigger: { type: 'interaction', targetId: 'flower-window' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 1240, focusY: 202, durationMs: 700 },
    visualEffect: { type: 'flower-memory', durationMs: 4000 },
    completionFlag: 'act2.flowerWindowMemory.completed',
  },
  {
    id: 'shadow-overlap',
    zone: { minX: 2550, maxX: 2630 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 2590, focusY: 208, durationMs: 500 },
    visualEffect: { type: 'shadow-overlap', durationMs: 1800 },
    completionFlag: 'act3.shadowOverlap.completed',
  },
  {
    id: 'npc-distance',
    zone: { minX: 3490, maxX: 3540 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 3520, focusY: 202, durationMs: 0 },
    visualEffect: { type: 'npc-distance', durationMs: 0 },
    completionFlag: 'act4.npcDistance.completed',
  },
  {
    id: 'flower-phone-call',
    zone: { minX: 760, maxX: 850 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 815, focusY: 190, durationMs: 350 },
    visualEffect: { type: 'phone-call', durationMs: 12000 },
    completionFlag: 'act1.flowerPhoneCall.completed',
  },
  {
    id: 'memorial-stone-discovery',
    zone: { minX: 4170, maxX: 4300 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: false,
    cameraCue: { focusX: 4240, focusY: 220, durationMs: 0 },
    visualEffect: { type: 'memorial-stone', durationMs: 0 },
    completionFlag: 'act4.memorialStoneDiscovered',
  },
  {
    id: 'coat-transfer',
    zone: { minX: 5060, maxX: 5220 },
    trigger: { type: 'zone' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 5150, focusY: 200, durationMs: 700 },
    dialogue: {
      title: '街灯下',
      body: '男：“收下吧。”\n女：“……保重。”',
      footer: '',
    },
    visualEffect: { type: 'coat-transfer', durationMs: 5600 },
    completionFlag: 'act5.coatTransfer.completed',
  },
  {
    id: 'bench-finale',
    zone: { minX: 5940, maxX: 6100 },
    trigger: { type: 'interaction', targetId: 'bench-sit' },
    once: true,
    lockInput: true,
    cameraCue: { focusX: 6020, focusY: 205, durationMs: 600 },
    visualEffect: { type: 'finale', durationMs: 5200 },
    completionFlag: 'act5.benchFinale.completed',
  },
];
