<script lang="ts">
  import api from '@/api';
  import { mapStores } from 'pinia';

  import VapingLogView from '@/views/VapingLogView.vue';

  import { useHelpMeNowStore } from '@/stores/helpMeNowStore';
  import { useNotiStore } from '@/stores/notiStore';

  export default {
    name: 'CravingLogView',

    components: {
      VapingLogView,
    },

    data() {
      return {
        vaped: null as boolean | null,
        activities: [] as {
          id: string;
          name: string;
          effective: boolean;
        }[],
      };
    },

    computed: {
      ...mapStores(useHelpMeNowStore, useNotiStore),
    },

    methods: {
      handleSubmit() {
        if (this.helpMeNowStore.startTime === null) {
          alert('Start time is missing. Please go back and try again.');
          return;
        }

        api.sessions
          .createCravingLog({
            startTime: this.helpMeNowStore.startTime,
            duration: this.helpMeNowStore.duration,
            triggers: [],
            activities: {
              effective: this.activities.filter((a) => a.effective).map((a) => a.id),
              ineffective: this.activities.filter((a) => !a.effective).map((a) => a.id),
            },
          })
          .then((data: { code: number; message: string }) => {
            if (import.meta.env.DEV) console.log('Response data:', data);

            if (!data || data.code !== 200) {
              throw new Error(data?.message || 'Unknown error');
            }

            // Reset state
            this.vaped = null;
            this.activities = [];
            this.helpMeNowStore.clear();

            // Notify user
            this.notificationStore.push({
              title: 'Success',
              content: 'Craving session logged successfully!',
              variant: 'success',
            });

            // Navigate to home
            this.$router.push({ name: 'Home' });
          })
          .catch((e: unknown) => {
            const message = e instanceof Error && e.message ? e.message : 'Please try again later.';
            this.notificationStore.push({
              title: 'Error',
              content: `Failed to log craving session: ${message}`,
              variant: 'danger',
            });
          });
      },
    },

    mounted() {
      this.activities = this.helpMeNowStore.activities.map((a) => ({
        id: a.id,
        name: a.name,
        effective: false,
      }));
    },
  };
</script>

<template>
  <main>
    <div class="banner">
      <h1 class="title">Log Craving Session</h1>
      <p class="sub">How did you go?</p>
    </div>

    <form action="">
      <section class="result-check">
        <h2 class="title">Did you vape?</h2>
        <div class="actions">
          <button
            type="button"
            :class="['no-button', vaped === false ? 'active' : '']"
            @click="vaped = false"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/multiply.png"
              alt="multiply"
            />
          </button>

          <button
            type="button"
            :class="['yes-button', vaped === true ? 'active' : '']"
            @click="vaped = true"
          >
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/checkmark--v1.png"
              alt="checkmark--v1"
            />
          </button>
        </div>

        <div class="message">
          {{
            vaped === null
              ? 'Please select an option'
              : vaped === true
                ? 'This is not the end of your journey. Keep going!'
                : "Great job! Let's log some activities that helped you."
          }}
        </div>

        <VapingLogView
          v-if="vaped === true"
          class="vaping-log"
          :startTime="helpMeNowStore.startTime"
        />
      </section>

      <section class="activity-log">
        <h2 class="title">Which activities were effective?</h2>
        <label v-for="activity in activities" :key="activity.id" :for="activity.id">
          <span>{{ activity.name }}</span>
          <input
            type="checkbox"
            :name="activity.id"
            :id="activity.id"
            v-model="activity.effective"
          />
        </label>
      </section>

      <button class="submit-button" type="submit" @click.prevent="handleSubmit">
        <img width="24" height="24" src="https://img.icons8.com/fluency/48/save.png" alt="save" />
        Log Craving Session
      </button>
    </form>
  </main>
</template>

<style scoped>
  main {
    padding: 0;
    padding-bottom: var(--padding);
    display: flex;
    flex-direction: column;
  }

  main > *:not(:first-child) {
    margin: 0 var(--padding);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--padding);
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

  .result-check {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    text-align: center;
    gap: var(--padding);
  }

  .result-check .actions {
    display: flex;
    flex-direction: row;
    gap: var(--padding);
  }

  .result-check .actions > * {
    flex: 1;
  }

  .no-button,
  .yes-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
  }

  .no-button,
  .yes-button {
    opacity: 0.5;
  }

  .no-button {
    background: #ef4444;
  }

  .yes-button {
    background: #10b981;
  }

  .active {
    opacity: 1;
  }

  .vaping-log {
    border-radius: var(--radius);
  }

  .activity-log {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: var(--padding);
  }

  .submit-button {
    background: #10b981;
    color: white;
  }
</style>
