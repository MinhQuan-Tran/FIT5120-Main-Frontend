import { defineStore } from 'pinia';
import api from '@/api';

import type Goal from '@/types/goal';

const useGoalStore = defineStore('goal', {
  state: () => ({
    todayGoals: [] as Goal[],
  }),

  actions: {
    async fetchTodayGoals() {
      try {
        const response = await api.goal.today();
        if (response.ok) {
          this.todayGoals = (await response.json()).data.map(
            (goal: { id: number; goal_text: string; is_completed: boolean }) => {
              return {
                id: goal.id,
                text: goal.goal_text,
                completed: goal.is_completed,
              } as Goal;
            },
          );
        } else {
          console.error("Failed to fetch today's goals");
        }
      } catch (error) {
        console.error('Error fetching today goals:', error);
      }
    },
  },
});

export default useGoalStore;
