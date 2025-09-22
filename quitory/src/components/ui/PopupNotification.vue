<script lang="ts">
  import { defineComponent, type PropType } from 'vue';

  import type { NoticeVariant } from '@/types/notification';

  export default defineComponent({
    name: 'PopupNotification',

    props: {
      title: {
        type: String,
        required: false,
        default: null,
      },

      variant: {
        type: String as PropType<NoticeVariant>,
        default: 'normal',
      },
    },

    computed: {
      role(): 'status' | 'alert' {
        return this.variant === 'danger' || this.variant === 'warning' ? 'alert' : 'status';
      },

      classes(): Record<string, boolean> {
        return {
          notice: true,
          'is-danger': this.variant === 'danger',
          'is-warning': this.variant === 'warning',
          'is-normal': this.variant === 'normal',
          'is-success': this.variant === 'success',
        };
      },

      iconFallback(): string {
        if (this.variant === 'success') return '✅';
        if (this.variant === 'danger') return '⚠️';
        if (this.variant === 'warning') return '💡';
        return 'ℹ️';
      },
    },
  });
</script>

<template>
  <div :class="classes" :role="role" aria-live="polite">
    <div class="icon" aria-hidden="true">
      <slot name="icon">{{ iconFallback }}</slot>
    </div>

    <div class="content-wrapper">
      <span v-if="title" class="title">{{ title }}</span>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Base */
  .notice {
    --bg: #ffffff;
    --border: #e5e7eb;
    --text: #111827;
    --icon: #6b7280;

    display: flex;
    align-items: flex-start;
    gap: 10px;

    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--text);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  }

  /* Variants */
  .is-danger {
    --bg: #fef2f2;
    --border: #fecaca;
    --text: #991b1b;
    --icon: #dc2626;
  }

  .is-warning {
    --bg: #fffbeb;
    --border: #fde68a;
    --text: #92400e;
    --icon: #d97706;
  }

  .is-normal {
    --bg: #ffffff;
    --border: #e5e7eb;
    --text: #111827;
    --icon: #6b7280;
  }

  .is-success {
    --bg: #ecfdf5;
    --border: #6ee7b7;
    --text: #065f46;
    --icon: #10b981;
  }

  /* Parts */
  .icon {
    font-size: 18px;
    line-height: 1;
    margin-top: 2px;
    color: var(--icon);
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  .title {
    font-weight: bold;
    height: 18px;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .close {
    margin-left: 8px;
    border: 0;
    background: transparent;
    color: var(--text);
    opacity: 0.75;
    font-size: 16px;
    line-height: 1;
    padding: 2px 4px;
    border-radius: 6px;
    cursor: pointer;
  }

  .close:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.04);
  }

  .close:focus-visible {
    outline: 2px solid var(--icon);
    outline-offset: 2px;
  }
</style>
