<script lang="ts">
  export default {};
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
          src="https://img.icons8.com/fluency/96/musical-notes.png"
          alt="musical-notes"
        />
        <h2>Go for a walk</h2>
        <p>Physical activity can help reduce cravings and improve your mood.</p>
      </div>
    </div>

    <button class="activity-button">
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
    background: linear-gradient(135deg, #b39aff, #ff8ec8);
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
