// src/main.ts
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { useAuthStore } from '@/stores/authStore';

// Capacitor (guarded use)
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const auth = useAuthStore();

async function initStatusBar(): Promise<void> {
  // Only run on native platforms where the plugin exists
  const isNative = Capacitor.isNativePlatform?.() ?? Capacitor.getPlatform() !== 'web';
  const hasPlugin = Capacitor.isPluginAvailable?.('StatusBar') ?? false;
  if (!isNative || !hasPlugin) return;

  // Keep content BELOW the status bar (no overlap)
  await StatusBar.setOverlaysWebView({ overlay: false });

  // Solid bar color + dark icons to match your theme
  await StatusBar.setBackgroundColor({ color: '#121318' });
  await StatusBar.setStyle({ style: Style.Dark });

  // If you ever need these at runtime, call them where needed:
  // await StatusBar.hide();
  // await StatusBar.show();
}

auth.init().finally(() => {
  app.mount('#app');
  // Fire-and-forget; safe on web because of the guards
  initStatusBar().catch(() => {
    /* noop */
  });
});
