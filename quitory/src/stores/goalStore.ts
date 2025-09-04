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

        this.todayGoals = response.data.map(
          (goal: { id: number; goal_text: string; is_completed: boolean }) => {
            return {
              id: goal.id,
              text: goal.goal_text,
              completed: goal.is_completed,
            } as Goal;
          },
        );
      } catch (error) {
        console.error('Error fetching today goals:', error);
      }
    },
  },
});

export default useGoalStore;
