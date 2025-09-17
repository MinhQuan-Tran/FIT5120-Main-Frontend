// src/main.ts
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import useAuthStore from '@/stores/authStore';
import { Capacitor } from '@capacitor/core';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();

// If in dev mode and in mobile app
if (import.meta.env.DEV && Capacitor.isNativePlatform()) {
  import('@/utils/setupDebugOverlay').then(({ setupDebugOverlay }) => {
    setupDebugOverlay({ enabled: true });
  });
}

auth.init().finally(() => {
  app.mount('#app');
});
