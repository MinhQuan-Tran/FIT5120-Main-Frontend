<script lang="ts">
  import api from '@/api';
  import { mapStores } from 'pinia';

  import { useHelpMeNowStore } from '@/stores/helpMeNowStore';
  import { type DistractionActivity } from '@/types/distraction';

  export default {
    name: 'HelpMeNowView',

    data() {
      return {
        name: 'Loading...',
        description: 'Please wait while we find an activity for you.',
      };
    },

    computed: {
      ...mapStores(useHelpMeNowStore),
    },

    methods: {
      async fetchActivity() {
        this.name = 'Loading...';
        this.description = 'Please wait while we find an activity for you.';

        try {
          const response = await api.distraction.actions.random();

          // Map API → local shape
          const activity = {
            id: response.data.id ?? undefined,
            name: String(response.data.activity_name ?? 'Activity'),
            description: String(response.data.activity_description ?? ''),
          };

          // Update UI
          this.name = activity.name;
          this.description = activity.description;

          // Persist to store for the next screen
          this.helpMeNowStore.push(activity as DistractionActivity);
        } catch (e: unknown) {
          this.name = 'Something went wrong';
          this.description =
            e instanceof Error && e.message ? e.message : 'Please try again later.';
        }
      },
    },

    mounted() {
      this.helpMeNowStore.clear();
      this.fetchActivity();
    },
  };
</script>

<template>
  <main>
    <div class="banner">
      <h1 class="title">Distract Me</h1>
      <p class="sub">Take some activities to ride out your craving</p>
    </div>

    <div class="activity">
      <div class="card">
        <img
          width="96"
          height="96"
          src="https://img.icons8.com/fluency/96/walking.png"
          alt="walking"
        />
        <h2>{{ name }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>

    <button class="activity-button" @click="fetchActivity">
      <img
        width="24"
        height="24"
        src="https://img.icons8.com/material-rounded/24/available-updates.png"
        alt="available-updates"
      />
      Try Another Activity
    </button>

    <button class="end-button" @click="$router.push('/cravings/log')">
      <img
        width="24"
        height="24"
        src="https://img.icons8.com/ios-glyphs/30/FFFFFF/checkmark--v1.png"
        alt="checkmark--v1"
      />
      It's Over
    </button>
  </main>
</template>

<style scoped>
  main {
    background-color: white;
    padding: 0;
    padding-bottom: var(--padding);
    display: flex;
    flex-direction: column;
  }

  main > *:not(:first-child) {
    margin: 0 var(--padding);
  }

  .banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
    text-align: center;
    padding: 20px;
    background: linear-gradient(90deg, #6366f1, #9333ea);
  }

  .banner .title {
    color: white;
  }

  .banner .sub {
    color: rgb(255, 255, 255, 0.8);
  }

  .activity {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }

  .activity .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: var(--padding);
    padding: 20px 0;
    background: rgba(17, 112, 255, 0.1);
    border: 1px solid #c9e1ff;
    border-radius: var(--radius);
  }

  .activity img {
    background: white;
    border-radius: var(--radius);
    margin: 24px 0;
  }

  .activity-button,
  .end-button {
    gap: 8px;
  }

  .activity-button:hover img {
    animation: rotate 0.3s ease;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }

  .end-button {
    background: #10b981;
    color: white;
  }
</style>
