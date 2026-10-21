export type StoryEvent<TVisualEffect extends string = string> = {
  id: string;
  zone: { minX: number; maxX: number };
  trigger:
    | { type: 'interaction'; targetId: string }
    | { type: 'zone' };
  once: boolean;
  lockInput: boolean;
  cameraCue: { focusX: number; focusY: number; durationMs: number };
  dialogue?: { title: string; body: string; footer: string };
  narrationLines?: readonly string[];
  caption?: string;
  visualEffect: {
    type: TVisualEffect;
    durationMs: number;
  };
  completionFlag: string;
};
