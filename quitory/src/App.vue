<script lang="ts">
  import { defineComponent } from 'vue';
  import { RouterView } from 'vue-router';
  import NavBar from '@/components/layout/NavBar.vue';
  import useAuthStore from '@/stores/authStore';
  import { AuthStatus } from '@/types/user';
  import { Capacitor } from '@capacitor/core';

  export default defineComponent({
    name: 'App',

    data() {
      return {
        isApp: false,
      };
    },

    components: {
      NavBar,
      RouterView,
    },

    computed: {
      auth() {
        return useAuthStore();
      },

      showNavBar(): boolean {
        // Show navigation bar if authenticated
        return this.auth.status === AuthStatus.Authenticated;
      },
    },

    mounted() {
      this.isApp = Capacitor.isNativePlatform();
      this.auth.init();
    },
  });
</script>

<template>
  <div :style="{ marginTop: isApp ? '40px' : '0' }"></div>
  <RouterView />
  <NavBar v-if="showNavBar" />
</template>

<style scoped></style>
