<script lang="ts">
  import { defineAsyncComponent } from 'vue';
  import { mapState } from 'pinia';
  import { useAuthStore } from '@/stores/authStore';
  import Skeleton from '@/components/ui/SkeletonUI.vue';

  export default {
    name: 'HomeGate',

    components: {
      // Landing: defineAsyncComponent(() => import('@/views/LandingView.vue')),
      Dashboard: defineAsyncComponent(() => import('@/views/DashboardView.vue')),
      Skeleton,
    },

    computed: {
      ...mapState(useAuthStore, ['status']),
    },

    methods: {
      maybeRedirect() {
        // Check if the user is authenticated and there's a next route
        const next = this.$route.query.next;
        if (this.status === 'authenticated' && typeof next === 'string') {
          this.$router.replace(next);
        }
      },
    },

    watch: {
      status(val: string) {
        if (val === 'authenticated') this.maybeRedirect();
      },
    },

    mounted() {
      this.maybeRedirect();
    },
  };
</script>

<template>
  <!-- While auth is booting -->
  <Skeleton v-if="status === 'loading'" :bars="1" :cards="2" />

  <Suspense v-else>
    <template #default>
      <!-- TODO: Update this -->
      <!-- <component :is="isAuthenticated ? 'Dashboard' : 'Landing'" /> -->
      <Dashboard></Dashboard>
    </template>

    <!-- Async view fallback -->
    <template #fallback>
      <Skeleton :bars="1" :cards="2" />
    </template>
  </Suspense>
</template>

<style scoped></style>
