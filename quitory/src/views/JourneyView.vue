<script lang="ts">
  import AchievementCard from '@/components/ui/AchievementCard.vue';
  import type Achievement from '@/types/achievement';
  import { AchievementType } from '@/types/achievement';

  export default {
    name: 'JourneyView',

    components: {
      AchievementCard,
    },

    data() {
      return {
        achievements: [] as Achievement[],
      };
    },

    computed: {
      personalAchievements(): Achievement[] {
        return this.achievements.filter((a) => a.type === 'personal');
      },

      groupAchievements(): Achievement[] {
        return this.achievements.filter((a) => a.type === 'group');
      },
    },

    methods: {
      fetchAchievements() {
        // Dummy data
        this.achievements = [
          {
            id: '1',
            name: 'First Steps',
            type: AchievementType.Personal,
            icon: 'https://img.icons8.com/plumpy/48/sprout.png',
            color: '#FFD700',
            description: 'Completed your first task!',
            timeEarned: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            name: 'Team Player',
            type: AchievementType.Group,
            icon: 'https://img.icons8.com/ios-glyphs/30/handshake--v1.png',
            color: '#C0C0C0',
            description: 'Contributed to a group project!',
            timeEarned: '2025-02-20T14:30:00Z',
          },
          // Add more achievements as needed
        ];
      },
    },

    mounted() {
      this.fetchAchievements();
    },
  };
</script>

<template>
  <main>
    <!-- <section class="milestones"></section> -->
    <section class="personal-achievements">
      <div class="header">
        <h2 class="title">Personal Achievements</h2>
        <span class="count">8 earned</span>
      </div>
      <div class="achievements-list">
        <AchievementCard
          v-for="achievement in personalAchievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>
    </section>
    <section class="group-achievements">
      <div class="header">
        <h2 class="title">Group Achievements</h2>
        <span class="count">8 earned</span>
      </div>
      <div class="achievements-list">
        <AchievementCard
          v-for="achievement in groupAchievements"
          :key="achievement.id"
          :achievement="achievement"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
  section .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .title {
    font-size: 1em;
    font-weight: bold;
  }

  .count {
    font-size: 0.875em;
    color: #666;
  }

  .achievements-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
  }
</style>
