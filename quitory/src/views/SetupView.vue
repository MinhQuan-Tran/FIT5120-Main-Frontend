<script lang="ts">
  import api from '@/api';
  import { mapStores } from 'pinia';
  import { defineComponent } from 'vue';

  import { useNotiStore } from '@/stores/notiStore';
  import { useAuthStore } from '@/stores/authStore';

  import { getNameSuggestions } from '@/utils/namePool';

  export default defineComponent({
    name: 'SetupView',

    data() {
      return {
        suggestions: [] as string[],
        selected: null as string | null,
        loading: false as boolean,
      };
    },

    computed: {
      ...mapStores(useNotiStore, useAuthStore),

      canContinue(): boolean {
        return !!this.selected;
      },
    },

    methods: {
      refreshSuggestions() {
        // Generate 5 unique suggestions. Keep selection if it still exists; otherwise clear.
        const next = getNameSuggestions(5);
        const keep = this.selected && next.includes(this.selected) ? this.selected : null;
        this.suggestions = next;
        this.selected = keep;
      },

      choose(name: string) {
        this.selected = name;
      },

      onKeySelect(e: KeyboardEvent, name: string) {
        // Accessible selection by keyboard
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.choose(name);
        }
      },

      async onSubmit() {
        if (!this.selected || this.loading) return;
        this.loading = true;
        try {
          const response = await api.user.setup({ name: this.selected });
          console.log('Setup response:', response);

          if (response.code !== 200 || !response.data) {
            throw new Error(response.error || 'Failed to set display name');
          }

          this.authenticationStore.user = response.data;

          this.notificationStore.push({
            title: 'Success',
            content: 'Display name set!',
            variant: 'success',
          });

          // TODO: Redirect to Onboarding
          await this.$router.push({ name: 'Home' });
        } finally {
          this.loading = false;
        }
      },
    },

    mounted() {
      this.refreshSuggestions();
    },
  });
</script>

<template>
  <main class="setup">
    <section class="card">
      <h1 class="title">Choose your display name</h1>
      <p class="sub">Pick a name to use in the app. You can randomise suggestions if none fit.</p>

      <div class="list" role="radiogroup" aria-label="Name suggestions">
        <button
          v-for="name in suggestions"
          :key="name"
          type="button"
          class="option"
          :class="{ selected: selected === name }"
          role="radio"
          :aria-checked="selected === name"
          @click="choose(name)"
          @keydown="onKeySelect($event, name)"
        >
          <!-- (optional) icon slot/placeholder -->
          <!-- <span class="icon" aria-hidden="true"></span> -->

          <span class="radio" aria-hidden="true"></span>
          <span class="label">{{ name }}</span>
        </button>
      </div>

      <div class="actions">
        <button class="ghost" type="button" @click="refreshSuggestions" :disabled="loading">
          Randomize
        </button>
        <button class="primary" type="button" @click="onSubmit" :disabled="!canContinue || loading">
          Use this name
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .setup {
    display: grid;
    place-items: center;
    min-height: calc(100dvh - 64px);
    padding: 16px;
  }

  .card {
    background: #fff;
    border-radius: 14px;
    padding: 20px 18px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    width: 100%;
    max-width: 560px;
  }

  .title {
    margin: 0 0 6px;
    font-weight: 800;
    font-size: 22px;
  }

  .sub {
    margin: 0 0 14px;
    color: #64748b;
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }

  .option {
    display: grid;
    grid-template-columns: 20px 1fr;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;

    padding: 12px 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .option:hover {
    border-color: #cbd5e1;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  }

  .option:focus-visible {
    outline: 2px solid #93c5fd;
    outline-offset: 2px;
  }

  .option.selected {
    border-color: #60a5fa;
    background: #f0f7ff;
  }

  .radio {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 2px solid #94a3b8;
    position: relative;
  }

  .option.selected .radio {
    border-color: #2563eb;
  }

  .option.selected .radio::after {
    content: '';
    position: absolute;
    inset: 2px;
    border-radius: 999px;
    background: #2563eb;
  }

  .label {
    font-weight: 700;
    color: #0f172a;
    /* (optional) place an icon to the left by adding .icon before .radio and adjusting grid */
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 14px;
  }

  button.primary {
    background: #2563eb;
    color: #fff;
    border: 1px solid #1d4ed8;
    padding: 10px 14px;
    border-radius: 10px;
    font-weight: 700;
  }

  button.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.ghost {
    background: #fff;
    color: #0f172a;
    border: 1px solid #e5e7eb;
    padding: 10px 14px;
    border-radius: 10px;
    font-weight: 700;
  }
  button.ghost:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
