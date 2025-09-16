// src/main.ts
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import useAuthStore from '@/stores/authStore';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();

if (import.meta.env.DEV || localStorage.getItem('DEBUG_OVERLAY') === '1') {
  import('@/utils/setupDebugOverlay').then(({ setupDebugOverlay }) => {
    setupDebugOverlay({ enabled: true });
  });
}

auth.init().finally(() => {
  app.mount('#app');
});
