<script lang="ts">
  import { defineComponent } from 'vue';
  import { RouterView } from 'vue-router';
  import AppHeader from '@/components/layout/AppHeader.vue';
  import useAuthStore from '@/stores/authStore';
  import { AuthStatus } from '@/types/user';

  export default defineComponent({
    name: 'App',

    components: {
      AppHeader,
      RouterView,
    },

    computed: {
      auth() {
        return useAuthStore();
      },

      showHeader(): boolean {
        return (
          Boolean(this.$route.meta.requiresAuth) && this.auth.status === AuthStatus.Authenticated
        );
      },
    },
  });
</script>

<template>
  <AppHeader v-if="showHeader" />
  <RouterView />
</template>

<style scoped></style>
