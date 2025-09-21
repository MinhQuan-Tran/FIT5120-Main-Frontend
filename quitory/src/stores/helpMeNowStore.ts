import { defineStore } from 'pinia';

import { type DistractionActivity } from '@/types/distraction';

const SESSION_KEY = 'distraction.batch';
const MAX_KEEP = 50; // cap to avoid unbounded growth

export const useHelpMeNowStore = defineStore('helpMeNow', {
  state: () => ({
    startTime: new Date(),
    activities: [] as DistractionActivity[],
  }),

  getters: {
    hasItems(state): boolean {
      return state.activities.length > 0;
    },
  },

  actions: {
    push(a: DistractionActivity) {
      if (!this.hasItems) {
        this.startTime = new Date();
      }

      this.activities.push(a);
      if (this.activities.length > MAX_KEEP) {
        this.activities.splice(0, this.activities.length - MAX_KEEP);
      }
      this._save();

      console.log(this.activities);
    },

    clear() {
      this.activities = [];
      this._save();
    },

    fetch() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          this.activities = arr as DistractionActivity[];
        }
      } catch {
        // ignore corrupt session
      }
    },

    _save() {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.activities));
      } catch {
        // storage might be full/blocked; it's only a convenience
      }
    },
  },
});
