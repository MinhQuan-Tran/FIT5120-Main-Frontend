<script lang="ts">
  export default {};
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">
        <img src="" alt="" />
        Home
      </RouterLink>

      <RouterLink to="/journey">
        <img src="" alt="" />
        Journey
      </RouterLink>

      <RouterLink to="/group">
        <img src="" alt="" />
        Group
      </RouterLink>

      <RouterLink to="/session">
        <img src="" alt="" />
        Session
      </RouterLink>

      <RouterLink to="/profile">
        <img src="" alt="" />
        Profile
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
  header {
    background: #ffffff;
    padding: 12px 16px;
  }

  nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  nav a {
    text-decoration: none;
    color: #9ca3af;
    font-weight: bold;
    font-size: small;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  nav a.router-link-active {
    color: #3b82f6;
    border-bottom: 2px solid #3b82f6;
  }
</style>
