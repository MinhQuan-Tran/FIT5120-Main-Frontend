import { defineStore } from 'pinia';

import type { Notice } from '@/types/notification';

const timeoutMs = 5000; // default display duration

export const useNotiStore = defineStore('notification', {
  state: () => ({
    items: [] as Notice[],
    interval: null as number | null,
  }),

  getters: {
    currentNotice(state): Notice | null {
      return state.items.length > 0 ? state.items[0] : null;
    },
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

      this.items.push(n);

      if (this.items.length === 1) {
        this.interval = window.setInterval(() => {
          this.items.shift();

          if (this.items.length === 0) {
            clearInterval(this.interval!);
            this.interval = null;
          }
        }, timeoutMs);
      }

      return id;
    },
  },
});
