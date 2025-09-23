<script lang="ts">
  import { defineAsyncComponent } from 'vue';
  import { useAuthStore } from '@/stores/authStore';
  import Skeleton from '@/components/ui/SkeletonUI.vue';
  import { AuthStatus } from '@/types/user';

  export default {
    name: 'HomeGate',

    components: {
      Landing: defineAsyncComponent(() => import('@/views/LandingView.vue')),
      Dashboard: defineAsyncComponent(() => import('@/views/DashboardView.vue')),
      Skeleton,
    },

    data() {
      return {
        AuthStatus,
        authStore: useAuthStore(),
      };
    },

    methods: {
      maybeRedirect() {
        // Check if the user is authenticated and there's a next route
        const next = this.$route.query.next;
        if (this.authStore.status === AuthStatus.Authenticated && typeof next === 'string') {
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
  <Skeleton v-if="authStore.status === AuthStatus.Loading" :bars="1" :cards="2" />

  <Suspense v-else>
    <template #default>
      <!-- Render Dashboard if authenticated, otherwise Landing -->
      <component :is="authStore.status === AuthStatus.Authenticated ? 'Dashboard' : 'Landing'" />
    </template>

    <!-- Async view fallback -->
    <template #fallback>
      <Skeleton :bars="1" :cards="2" />
    </template>
  </Suspense>
</template>

<style scoped></style>
