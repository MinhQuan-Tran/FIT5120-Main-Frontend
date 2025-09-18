<script lang="ts">
  export default {};
</script>

<template>
  <main>
    <section class="help-me-now" @click="$router.push('/help-me-now')">
      <img width="96" height="96" src="https://img.icons8.com/fluency/96/trust.png" alt="trust" />
      <h1 class="title">Help Me Now</h1>
      <p class="sub">Immediate support when cravings hit</p>
    </section>
  </main>
</template>

<style scoped>
  .help-me-now {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--padding);
    text-align: center;
    cursor: pointer;
    background: linear-gradient(90deg, #ef4444, #ec4899);
  }

  .help-me-now img {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    padding: var(--padding);
  }

  .help-me-now .title {
    color: white;
  }

  .help-me-now .sub {
    color: rgb(255, 255, 255, 0.8);
  }
</style>
