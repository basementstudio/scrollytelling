type Callback = (...args: unknown[]) => void;

export class Emitter {
  events: Record<string, Callback[]>;

  constructor() {
    this.events = {};
  }

  emit(event: string, ...args: unknown[]) {
    const callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) {
      callbacks[i]?.(...args);
    }
  }

  on(event: string, cb: Callback) {
    // Add the callback to the event's callback list, or create a new list with the callback
    this.events[event]?.push(cb) || (this.events[event] = [cb]);

    // Return an unsubscribe function
    return () => {
      this.off(event, cb);
    };
  }

  off(event: string, cb: Callback) {
    this.events[event] = this.events[event]?.filter((i) => cb !== i) ?? [];
  }

  destroy() {
    this.events = {};
  }
}
