<script lang="ts">
  export default {
    props: {
      bars: { type: Number, default: 1 },
      cards: { type: Number, default: 2 },
      /** mobile height (px) */
      cardHeight: { type: Number, default: 88 },
      /** md+ height (px) */
      cardHeightMd: { type: Number, default: 120 },
      /** spacing (px) */
      gap: { type: Number, default: 12 },
      /** padding (px) */
      padding: { type: Number, default: 16 },
    },
  };
</script>

<template>
  <div
    class="skeleton"
    role="status"
    aria-busy="true"
    :style="
      {
        '--sk-gap': gap + 'px',
        '--sk-pad': padding + 'px',
        '--sk-card-h': cardHeight + 'px',
        '--sk-card-h-md': cardHeightMd + 'px',
      } as Record<string, string>
    "
  >
    <div v-for="n in bars" :key="'b' + n" class="bar"></div>
    <div v-for="n in cards" :key="'c' + n" class="card"></div>
  </div>
</template>

<style scoped>
  .skeleton {
    padding: var(--sk-pad);
    display: grid;
    gap: var(--sk-gap);
  }

  .bar {
    height: 14px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.08);
  }

  @media (min-width: 768px) {
    .skeleton {
      --sk-pad: calc(var(--sk-pad) + 8px);
      --sk-gap: calc(var(--sk-gap) + 4px);
    }

    .card {
      height: var(--sk-card-h-md);
    }
  }
</style>
