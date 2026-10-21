import Phaser from 'phaser';

import type { StoryEvent } from '../data/fujiEvents';

export type StoryState = 'not_started' | 'running' | 'completed';

export class StoryDirector {
  private readonly states = new Map<string, StoryState>();
  private readonly completedFlags: Set<string>;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly events: readonly StoryEvent[],
  ) {
    const saved = scene.registry.get('completedStoryEvents') as string[] | undefined;
    this.completedFlags = new Set(saved ?? []);

    for (const event of events) {
      this.states.set(
        event.id,
        this.completedFlags.has(event.completionFlag) ? 'completed' : 'not_started',
      );
    }
  }

  begin(eventId: string, playerX: number): StoryEvent | null {
    const event = this.events.find((candidate) => candidate.id === eventId);
    if (
      !event ||
      this.states.get(event.id) !== 'not_started' ||
      playerX < event.zone.minX ||
      playerX > event.zone.maxX
    ) {
      return null;
    }

    this.states.set(event.id, 'running');
    return event;
  }

  complete(event: StoryEvent): void {
    this.states.set(event.id, 'completed');
    if (event.once) {
      this.completedFlags.add(event.completionFlag);
      this.scene.registry.set('completedStoryEvents', [...this.completedFlags]);
    }
  }

  isCompleted(eventId: string): boolean {
    return this.states.get(eventId) === 'completed';
  }
}
