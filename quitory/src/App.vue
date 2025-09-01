<script lang="ts">
  import { RouterView } from 'vue-router';
  import AppHeader from '@/components/layout/AppHeader.vue';

  export default {
    components: {
      AppHeader,
      RouterView,
    },
  };
</script>

<template>
  <AppHeader />
  <RouterView />
</template>

<style scoped></style>
