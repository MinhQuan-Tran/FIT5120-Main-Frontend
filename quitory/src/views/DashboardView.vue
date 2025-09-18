<script lang="ts">
  import { mapStores } from 'pinia';

  import useAuthStore from '@/stores/authStore';
  import useGoalStore from '@/stores/goalStore';
  import PopupNotification from '@/components/ui/PopupNotification.vue';

  export default {
    components: {
      PopupNotification,
    },

    data() {
      return {
        progress: 0,
      };
    },

    computed: {
      ...mapStores(useAuthStore, useGoalStore),
      user() {
        return useAuthStore().user;
      },
    },

    mounted() {
      setTimeout(() => {
        this.progress = 76;
      }, 1500);
    },
  };
</script>

<template>
  <main class="dashboard-view">
    <!-- Top banner -->
    <section class="banner">
      <div class="banner-copy">
        <p class="banner-hello">Welcome back, {{ user?.name || 'User' }}!</p>
        <p class="banner-sub">You're doing amazing</p>
      </div>

      <!-- avatar -->
      <div class="banner-avatar" aria-hidden="true">
        <img :src="user?.profilePictureURL" alt="User avatar" />
      </div>
    </section>

    <!-- Summary: days + progress + quick stats -->
    <section class="summary">
      <div class="summary-days">
        <div class="summary-num">23</div>
        <div class="summary-label">Days Vape-Free</div>
      </div>

      <div class="progress">
        <progress :value="progress" max="100"></progress>
        <div class="progress-hint">{{ progress }}% to 30-day milestone</div>
      </div>

      <div class="summary-stats">
        <div class="stat stat-green">
          <div class="stat-value">$184</div>
          <div class="stat-label">Money Saved</div>
        </div>
        <div class="stat stat-blue">
          <div class="stat-value">552</div>
          <div class="stat-label">Hours Regained</div>
        </div>
      </div>
    </section>

    <PopupNotification variant="danger" title="Danger Time Alert">
      You're approaching a high-risk window. Stay strong!
      <div class="triggers">
        <span>Common triggers:</span>
        <div>Stress</div>
        <div>After meals</div>
        <div>Work breaks</div>
      </div>
    </PopupNotification>

    <!-- Goals -->
    <section class="goals" aria-labelledby="goals-title">
      <div class="goals-header">
        <b id="goals-title" class="section-title">Today's Goals</b>
      </div>

      <br />

      <div class="goals-list">
        <!-- Completed -->
        <label class="goal-item">
          <input type="checkbox" checked />
          <span class="goal-check" aria-hidden="true"></span>
          <span class="goal-text">Drink 8 glasses of water</span>
        </label>

        <!-- Completed -->
        <label class="goal-item">
          <input type="checkbox" checked />
          <span class="goal-check" aria-hidden="true"></span>
          <span class="goal-text">10-minute walk</span>
        </label>

        <!-- Not completed -->
        <label class="goal-item">
          <input type="checkbox" />
          <span class="goal-check" aria-hidden="true"></span>
          <span class="goal-text">Practice deep breathing</span>
        </label>

        <label class="goal-item">
          <input type="checkbox" />
          <span class="goal-check" aria-hidden="true"></span>
          <span class="goal-text">Read for 20 minutes</span>
        </label>

        <label v-for="goal in goalStore.todayGoals" :key="goal.id" class="goal-item">
          <input type="checkbox" v-model="goal.completed" />
          <span class="goal-check" aria-hidden="true"></span>
          <span class="goal-text">{{ goal.text }}</span>
        </label>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .triggers {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-top: 8px;
  }

  .triggers > div {
    background: rgba(255, 0, 0, 0.2);
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 12px;
    display: inline-block;
  }

  .dashboard-view {
    --start-color: #3b82f6;
    --end-color: #22c55e;
  }

  /* -------- Banner -------- */
  .banner {
    position: relative;
    overflow: hidden;
    padding: 16px;
    background: linear-gradient(135deg, #3b82f6, #22c55e);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .banner-hello {
    font-weight: 700;
    font-size: 18px;
    margin: 0 0 2px 0;
  }

  .banner-sub {
    margin: 0;
    font-size: 13px;
    opacity: 0.95;
  }

  .banner-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(255, 255, 255, 0.8);
    flex: 0 0 auto;
  }

  .banner-avatar img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  /* -------- Summary -------- */
  .summary {
    padding: 16px;
  }

  .summary-days {
    text-align: center;
  }

  .summary-num {
    font-size: 40px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
  }

  .summary-label {
    color: var(--muted);
    font-size: 14px;
  }

  /* Progress bar */
  .progress {
    margin: 14px auto 10px;
  }

  .progress-hint {
    text-align: center;
    margin-top: 6px;
    font-size: 12px;
    color: #6b7280;
  }

  .summary-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 14px;
  }

  .stat {
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
  }

  .stat-green {
    background: #f0fdf4;
    color: #16a34a;
  }

  .stat-blue {
    background: #eff6ff;
    color: #3b82f6;
  }

  .stat-value {
    font-weight: 800;
    font-size: 22px;
  }

  .stat-label {
    font-size: 12px;
    margin-top: 4px;
  }

  /* ---------- Goals (match mock) ---------- */
  .goals {
    background: #ffffff;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.06);
  }

  .goals-list {
    display: grid;
    gap: 12px;
  }

  /* Row */
  .goal-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #ffffff; /* white row by default */
    border: 1px solid #e5e7eb; /* gray-300 */
    border-radius: 12px;
    box-shadow: none; /* no drop shadow on rows */
    cursor: pointer;
    user-select: none;
    transition:
      transform 0.08s ease,
      box-shadow 0.2s ease;
  }

  /* Hide native checkbox but keep accessible */
  .goal-item input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  /* Left circular control */
  .goal-check {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: 2px solid #d1d5db; /* gray-300 */
    background: #ffffff;
    position: relative;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }

  /* Solid green tick when checked */
  .goal-item input:checked + .goal-check {
    background: #10b981; /* green-500 */
    border-color: #10b981;
  }
  .goal-item input:checked + .goal-check::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 4px;
    width: 8px;
    height: 14px;
    border: 2px solid #ffffff;
    border-left: 0;
    border-top: 0;
    transform: rotate(45deg);
  }

  /* Text */
  .goal-text {
    font-size: 15px;
    color: #374151; /* gray-700 */
  }

  .goal-item:active {
    transform: scale(0.99);
  }

  /* Row visuals when checked (Chromium supports :has) */
  .goal-item:has(input:checked) {
    background: #ecfdf5; /* green-50 */
    border-color: #bbf7d0; /* green-200 */
  }
  .goal-item:has(input:checked) .goal-text {
    color: #6b7280; /* gray-500 */
    text-decoration: line-through;
  }

  /* Focus ring */
  .goal-item:focus-within {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 98, 255, 0.15);
    border-color: #bfdbfe; /* blue-200 */
  }
</style>
