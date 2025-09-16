<script lang="ts">
  import { RouterLink } from 'vue-router';
  import { Capacitor } from '@capacitor/core';

  export default {
    components: {
      RouterLink,
    },
    data() {
      return {
        isApp: false,
      };
    },
    mounted() {
      this.isApp = Capacitor.isNativePlatform();
    },
  };
</script>

<template>
  <div :class="{ 'app-spacing': isApp }">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/progress">Progress</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/auth">Sign In</RouterLink>
      </nav>
    </header>
  </div>
</template>

<style scoped>
  .app-spacing {
    margin-top: 40px; /* adjust spacing as needed */
  }

  header {
    background: #ffffff;
    padding: 12px 16px;
    margin: 12px 0;
    border-radius: var(--radius);
  }

  nav {
    display: flex;
    gap: 12px;
  }

  nav a {
    text-decoration: none;
    color: #0f172a;
    font-weight: 600;
  }

  nav a:hover {
    text-decoration: underline;
  }
</style>
