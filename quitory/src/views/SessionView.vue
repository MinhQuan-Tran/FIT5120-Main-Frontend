<script lang="ts">
  export default {};
</script>

<template>
  <main>
    <section class="help-me-now" @click="$router.push('/help-me-now')">
      <h1>Help Me Now</h1>
      <p>Immediate support when cravings hit</p>
    </section>
  </main>
</template>

<style scoped>
  .help-me-now {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
  }
</style>
