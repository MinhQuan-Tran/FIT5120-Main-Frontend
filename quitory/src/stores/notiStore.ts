import { defineStore } from 'pinia';

export type NoticeVariant = 'normal' | 'warning' | 'danger';

export type Notice = {
  id: string;
  title?: string;
  content?: HTMLElement;
  variant?: NoticeVariant;
  to?: string; // optional link / route / path
  createdAt: number;
};

const timeoutMs = 5000; // default display duration

export const useNotifications = defineStore('notifications', {
  state: () => ({
    items: [] as Notice[],
    timers: new Map<string, number>(), // id -> timeout handle
    maxStack: 4,
    dedupeKeys: new Set<string>(), // optional dedupe support
  }),

  getters: {
    list: (s) => s.items,
  },

  actions: {
    push(info: Omit<Notice, 'id' | 'createdAt'>): string {
      const id = crypto.randomUUID();
      const n: Notice = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        variant: info.variant || 'normal', // default variant
        ...info,
      };

      // keep stack small (FIFO)
      if (this.items.length >= this.maxStack) {
        const removed = this.items.shift();
        if (removed) this._clearTimer(removed.id);
      }

      this.items.push(n);

      const handle = window.setTimeout(() => this.close(id), timeoutMs);
      this.timers.set(id, handle);

      return id;
    },

    close(id: string) {
      this.items = this.items.filter((n) => n.id !== id);
      this._clearTimer(id);
    },

    clearAll() {
      for (const n of this.items) this._clearTimer(n.id);
      this.items = [];
      this.dedupeKeys.clear();
    },

    _clearTimer(id: string) {
      const handle = this.timers.get(id);
      if (handle) {
        clearTimeout(handle);
        this.timers.delete(id);
      }
    },
  },
});
