<script lang="ts">
  export default {};
</script>

<template>
  <main>
    <div class="banner">
      <h1 class="title">Log a Craving</h1>
      <p class="sub">How did you go?</p>
    </div>

    <section class="result-check">
      <h2 class="title">Did you vape?</h2>
      <div class="actions">
        <button class="no-button">
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/multiply.png"
            alt="multiply"
          />
        </button>

        <button class="yes-button">
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/ios-glyphs/30/FFFFFF/checkmark--v1.png"
            alt="checkmark--v1"
          />
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
  main {
    padding: 0;
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

  .no-button {
    background: #ef4444;
  }

  .yes-button {
    background: #10b981;
  }
</style>
