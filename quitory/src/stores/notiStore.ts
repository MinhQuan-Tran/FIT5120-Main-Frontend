import { defineStore } from 'pinia';

export type NoticeVariant = 'normal' | 'warning' | 'danger';

export type Notice = {
  id: string;
  title?: string;
  content?: string;
  variant?: NoticeVariant;
  to?: string; // optional link / route / path
  createdAt: number;
};

const timeoutMs = 5000; // default display duration

export const useNotifications = defineStore('notifications', {
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
