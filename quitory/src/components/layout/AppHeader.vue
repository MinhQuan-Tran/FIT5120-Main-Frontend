<script lang="ts">
  import { RouterLink } from 'vue-router';

  export default {
    components: {
      RouterLink,
    },
  };
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/progress">Progress</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
  header {
    background: #f5f7fb;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
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
