<script lang="ts">
  import { defineComponent } from 'vue';
  import { useNotificationStore } from '@/stores/notiStore';
  import PopupNotification from '@/components/ui/PopupNotification.vue';

  export default defineComponent({
    name: 'NotificationCenter',
    components: { PopupNotification },
    setup() {
      const store = useNotificationStore();
      return { store };
    },

    mounted() {
      // For demo purposes, add a test notification every 5 seconds
      // In real usage, notifications would be added by other parts of the app/
      setInterval(() => {
        if (this.store.items.length >= 2) return; // max 2 at a time

        this.store.push({
          title: 'Test Notification',
          content: `This is a test notification. ${new Date().toLocaleTimeString()}`,
          variant: ['normal', 'warning', 'danger'][Math.floor(Math.random() * 3)] as
            | 'normal'
            | 'warning'
            | 'danger',
        });
      }, Math.random() * 15000);
    },
  });
</script>

<template>
  <div class="stack" aria-live="polite" aria-relevant="additions removals">
    <PopupNotification v-if="store.currentNotice" :variant="store.currentNotice?.variant">
      <template v-if="store.currentNotice?.title">
        <strong>{{ store.currentNotice.title }}</strong>
      </template>
      <template v-if="store.currentNotice?.content">{{ store.currentNotice.content }}</template>
    </PopupNotification>
  </div>
</template>

<style scoped>
  .stack {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 10px auto 0 auto;
    gap: 10px;
    max-width: min(92vw, 420px);
    z-index: 2147483647;
  }
</style>
