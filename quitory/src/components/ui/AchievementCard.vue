<script lang="ts">
  import { defineComponent } from 'vue';
  import type Achievement from '@/types/achievement';

  export default defineComponent({
    name: 'AchievementCard',

    props: {
      achievement: {
        type: Object as () => Achievement,
        required: true,
      },
    },

    computed: {
      formattedTimeEarned(): string {
        // Exclude year if same with current year
        const date = new Date(this.achievement.timeEarned);
        const now = new Date();

        if (date.getFullYear() === now.getFullYear()) {
          return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
        }

        return date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
  });
</script>

<template>
  <div>
    <div class="card">
      <img :src="achievement.icon" alt="Achievement Icon" class="icon" />
      <h3 class="name">{{ achievement.name }}</h3>
      <span class="time-earned">{{ formattedTimeEarned }}</span>
    </div>
  </div>
</template>

<style scoped>
  .card {
    box-sizing: border-box;
    text-align: center;
    width: 100px;
  }

  .icon {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }

  .name {
    font-size: small;
    margin: 8px 0;
    color: #333;
  }

  .description {
    font-size: smaller;
    color: #666;
    margin-bottom: 12px;
  }

  .time-earned {
    font-size: 0.875em;
    color: #16a34a;
  }

  .time-earned::before {
    content: '✓ ';
  }
</style>
