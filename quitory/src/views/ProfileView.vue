<script lang="ts">
  import { mapStores } from 'pinia';

  import useAuthStore from '@/stores/authStore';

  export default {
    computed: {
      ...mapStores(useAuthStore),
      user() {
        return useAuthStore().user;
      },
    },
  };
</script>

<template>
  <main class="profile-page">
    <!-- Profile hero -->
    <section class="profile-hero">
      <div class="avatar-wrap">
        <img class="avatar" :src="user?.profilePictureURL" alt="User avatar" />
        <!--
        <button class="avatar-edit" aria-label="Change photo">
          <span class="icon camera"></span>
        </button>
        -->
      </div>

      <div class="identity">
        <p class="name">{{ user?.name }}</p>
        <p class="email">alex.johnson@email.com</p>
        <p class="member-since">Member since March 2024</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value">23</div>
          <div class="stat-label">Days Clean</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">4</div>
          <div class="stat-label">Badges</div>
        </div>

        <div class="stat-card">
          <div class="stat-value">$184</div>
          <div class="stat-label">Saved</div>
        </div>
      </div>
    </section>

    <!-- Profile information -->
    <section>
      <div class="card-header">
        <h2 class="card-title">Profile Information</h2>
        <button class="link-btn" type="button">Edit</button>
      </div>

      <ul class="info-list">
        <li class="info-item">
          <div class="info-left">
            <span class="icon user"></span>
            <span class="info-label">Full Name</span>
          </div>
          <span class="info-value">{{ user?.name }}</span>
        </li>

        <li class="info-item">
          <div class="info-left">
            <span class="icon mail"></span>
            <span class="info-label">Email</span>
          </div>
          <span class="info-value">alex.johnson@email.com</span>
        </li>

        <li class="info-item">
          <div class="info-left">
            <span class="icon calendar"></span>
            <span class="info-label">Quit Date</span>
          </div>
          <span class="info-value">March 15, 2024</span>
        </li>

        <li class="info-item">
          <div class="info-left">
            <span class="icon dollar"></span>
            <span class="info-label">Daily Cost</span>
          </div>
          <span class="info-value">$8.00</span>
        </li>
      </ul>
    </section>

    <!-- Notifications -->
    <section>
      <h2 class="card-title">Notifications</h2>

      <div class="toggle-item">
        <div class="toggle-text">
          <p class="toggle-title">Daily Reminders</p>
          <p class="toggle-sub">Get reminded about your daily goals</p>
        </div>

        <!-- W3Schools switch -->
        <label class="switch" aria-label="Toggle Daily Reminders">
          <input type="checkbox" checked />
          <span class="slider round" aria-hidden="true"></span>
        </label>
      </div>

      <div class="toggle-item">
        <div class="toggle-text">
          <p class="toggle-title">Milestone Celebrations</p>
          <p class="toggle-sub">Celebrate your achievements</p>
        </div>
        <label class="switch" aria-label="Toggle Milestone Celebrations">
          <input type="checkbox" checked />
          <span class="slider round" aria-hidden="true"></span>
        </label>
      </div>

      <div class="toggle-item">
        <div class="toggle-text">
          <p class="toggle-title">Support Messages</p>
          <p class="toggle-sub">Motivational messages and tips</p>
        </div>
        <label class="switch" aria-label="Toggle Support Messages">
          <input type="checkbox" />
          <span class="slider round" aria-hidden="true"></span>
        </label>
      </div>

      <div class="toggle-item">
        <div class="toggle-text">
          <p class="toggle-title">Community Updates</p>
          <p class="toggle-sub">Updates from peer support groups</p>
        </div>
        <label class="switch" aria-label="Toggle Community Updates">
          <input type="checkbox" checked />
          <span class="slider round" aria-hidden="true"></span>
        </label>
      </div>

      <!-- Quiet Hours (optional UI – kept hidden for now)
      <div class="quiet-hours">
        <p class="quiet-title">Quiet Hours</p>
        <div class="quiet-row">
          <label class="quiet-field">
            <span class="quiet-label">From</span>
            <input class="quiet-input" type="time" value="22:00" />
          </label>

          <label class="quiet-field">
            <span class="quiet-label">To</span>
            <div class="quiet-input-wrap">
              <input class="quiet-input" type="time" value="08:00" />
              <span class="icon clock"></span>
            </div>
          </label>
        </div>
      </div>
      -->
    </section>

    <!-- Account -->
    <section>
      <h2 class="card-title">Account</h2>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon shield"></span>
          <span>Privacy Settings</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon export"></span>
          <span>Export Data</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon sync"></span>
          <span>Backup &amp; Sync</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="danger-row" type="button">
        <div class="nav-left">
          <span class="icon trash"></span>
          <span>Delete Account</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>
    </section>

    <!-- Help & Support -->
    <section>
      <h2 class="card-title">Help &amp; Support</h2>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon info"></span>
          <span>FAQ</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon headset"></span>
          <span>Contact Support</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon star"></span>
          <span>Rate App</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>

      <button class="nav-row" type="button">
        <div class="nav-left">
          <span class="icon heart"></span>
          <span>About Breathe Free</span>
        </div>
        <span class="icon chevron-right"></span>
      </button>
    </section>
  </main>
</template>

<style scoped>
  /* Layout */
  .profile-page {
    --start-color: #6366f1;
    --end-color: #a855f7;
  }

  /* Hero */
  .profile-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    padding: 24px 16px 0 16px;
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
  }

  /* Avatar */
  .avatar-wrap {
    position: relative;
    height: 84px;
    width: 84px;
  }

  .avatar {
    height: 84px;
    width: 84px;
    border-radius: 999px;
    border: 3px solid rgba(255, 255, 255, 0.85);
    object-fit: cover;
    background: #e5e7eb;
  }

  .avatar-edit {
    position: absolute;
    right: -2px;
    bottom: -2px;
    height: 28px;
    width: 28px;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(2, 6, 23, 0.2);
  }

  .identity {
    text-align: center;
    color: #ffffff;
    margin-top: 12px;
    margin-bottom: 16px;
  }

  .name {
    margin: 0 0 2px 0;
    font-weight: 800;
    font-size: 18px;
  }

  .email,
  .member-since {
    margin: 0;
    opacity: 0.9;
    font-size: 12px;
  }

  /* Stats */
  .stats-row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 12px 12px 16px 12px;
  }

  .stat-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 12px 8px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(2, 6, 23, 0.08);
  }

  .stat-value {
    font-weight: 800;
    font-size: 18px;
    color: #0f172a;
  }

  .stat-label {
    margin-top: 2px;
    font-size: 11px;
    color: #64748b;
  }

  /* Sections */
  .card-title {
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 800;
    color: #0f172a;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .link-btn {
    border: none;
    background: transparent;
    color: #3b82f6;
    font-weight: 700;
    font-size: 13px;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  /* Info list */
  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 4px;
    border-top: 1px solid #f1f5f9;
  }

  .info-item:first-child {
    border-top: none;
  }

  .info-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .info-label {
    font-size: 13px;
    color: #64748b;
  }

  .info-value {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  /* Toggle rows */
  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 4px;
    border-top: 1px solid #f1f5f9;
  }

  .toggle-item:first-of-type {
    border-top: none;
  }

  .toggle-text {
    max-width: calc(100% - 64px);
  }

  .toggle-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .toggle-sub {
    margin: 2px 0 0 0;
    font-size: 12px;
    color: #64748b;
  }

  /* ===========================
     W3Schools Switch (customized)
     https://www.w3schools.com/howto/howto_css_switch.asp
     =========================== */
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 26px;
    -webkit-tap-highlight-color: transparent;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #e2e8f0;
    transition: 0.2s;
    border-radius: 999px;
  }

  .slider:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    top: 3px;
    background: #ffffff;
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.12);
  }

  .switch input:checked + .slider {
    background: #22c55e;
  }

  .switch input:focus + .slider {
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
  }

  .switch input:checked + .slider:before {
    transform: translateX(18px);
  }

  .slider.round {
    border-radius: 999px;
  }

  /* Quiet hours */
  .quiet-hours {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
  }

  .quiet-title {
    margin: 0 0 10px 0;
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .quiet-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .quiet-field {
    display: grid;
    gap: 6px;
  }

  .quiet-label {
    font-size: 12px;
    color: #64748b;
  }

  .quiet-input-wrap {
    position: relative;
  }

  .quiet-input {
    width: 100%;
    height: 40px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    padding: 0 36px 0 12px;
    font-size: 14px;
    color: #0f172a;
  }

  .quiet-input:focus {
    outline: none;
    border-color: #94a3b8;
    background: #ffffff;
  }

  .quiet-input-wrap .icon.clock {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
  }

  /* Nav rows */
  .nav-row,
  .danger-row {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 14px 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    border: none;
    border-top: 1px solid #f1f5f9;
    text-align: left;
  }

  .nav-row:first-of-type,
  .danger-row:first-of-type {
    border-top: none;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #0f172a;
    font-weight: 600;
  }

  .danger-row .nav-left {
    color: #dc2626;
  }

  /* Icons (CSS-only placeholders) */
  .icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    position: relative;
    flex-shrink: 0;
    color: inherit;
  }

  .icon.chevron-left::before,
  .icon.chevron-right::before {
    content: '';
    position: absolute;
    inset: 0;
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    width: 8px;
    height: 8px;
    margin: auto;
    transform: rotate(135deg);
  }

  .icon.chevron-right::before {
    transform: rotate(-45deg);
  }

  .icon.menu::before,
  .icon.menu::after {
    content: '';
    position: absolute;
    left: 3px;
    right: 3px;
    height: 2px;
    background: currentColor;
  }

  .icon.menu::before {
    top: 5px;
    box-shadow: 0 6px 0 currentColor;
  }

  .icon.camera::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 2px solid currentColor;
    border-radius: 4px;
  }

  .icon.camera::after {
    content: '';
    position: absolute;
    top: 7px;
    left: 7px;
    width: 6px;
    height: 6px;
    border: 2px solid currentColor;
    border-radius: 999px;
  }

  .icon.user::before {
    content: '';
    position: absolute;
    left: 5.5px;
    right: 5.5px;
    top: 1.5px;
    height: 7px;
    border-radius: 999px;
    background: currentColor;
  }

  .icon.user::after {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    bottom: 1px;
    height: 8px;
    border-radius: 8px 8px 2px 2px;
    background: currentColor;
    opacity: 0.25;
  }

  .icon.mail::before {
    content: '';
    position: absolute;
    inset: 2px;
    border: 2px solid currentColor;
    border-radius: 4px;
  }

  .icon.mail::after {
    content: '';
    position: absolute;
    left: 3px;
    right: 3px;
    top: 6px;
    height: 2px;
    background: currentColor;
    transform: skewY(-15deg);
  }

  .icon.calendar::before,
  .icon.dollar::before,
  .icon.export::before,
  .icon.sync::before,
  .icon.trash::before,
  .icon.info::before,
  .icon.headset::before,
  .icon.star::before,
  .icon.heart::before,
  .icon.shield::before,
  .icon.clock::before {
    content: '';
    position: absolute;
    inset: 2px;
    border: 2px solid currentColor;
    border-radius: 4px;
    opacity: 0.9;
  }

  .icon.dollar::after {
    content: '$';
    position: absolute;
    inset: 0;
    font-size: 12px;
    font-weight: 800;
    display: grid;
    place-items: center;
  }

  .icon.export::after {
    content: '';
    position: absolute;
    left: 5px;
    right: 5px;
    top: 4px;
    height: 6px;
    border: 2px solid currentColor;
    border-bottom: none;
  }

  .icon.sync::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid currentColor;
    border-left-color: transparent;
    border-radius: 999px;
  }

  .icon.trash::after {
    content: '';
    position: absolute;
    left: 5px;
    right: 5px;
    top: 3px;
    height: 2px;
    background: currentColor;
  }

  .icon.info::after {
    content: 'i';
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-weight: 800;
  }

  .icon.headset::after {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    top: 4px;
    height: 6px;
    border: 2px solid currentColor;
    border-bottom: none;
  }

  .icon.star::after {
    content: '★';
    position: absolute;
    inset: 0;
    font-size: 12px;
    display: grid;
    place-items: center;
  }

  .icon.heart::after {
    content: '❤';
    position: absolute;
    inset: 0;
    font-size: 12px;
    display: grid;
    place-items: center;
    opacity: 0.9;
  }

  @media (min-width: 480px) {
    .stats-row {
      gap: 16px;
      padding-left: 16px;
      padding-right: 16px;
    }
    .card {
      margin-left: 16px;
      margin-right: 16px;
    }
  }
</style>
