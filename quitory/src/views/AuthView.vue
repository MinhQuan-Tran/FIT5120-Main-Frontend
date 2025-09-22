<script lang="ts">
  import { defineComponent } from 'vue';
  import { mapStores } from 'pinia';
  import useAuthStore from '@/stores/authStore';

  export default defineComponent({
    name: 'AuthView',

    data() {
      return {
        loading: false as boolean,
        err: null as string | null,
      };
    },

    computed: {
      // Expose Pinia store in Options API
      ...mapStores(useAuthStore),
    },

    methods: {
      // Send popup error to opener and close the popup
      handlePopupError(error: string, errorDescription?: string) {
        const isPopup = !!(window.opener && window.opener !== window);
        if (!isPopup) return;

        const payload = {
          source: 'oauth-popup',
          provider: 'google',
          ok: false,
          error,
          error_description: errorDescription,
        };

        try {
          window.opener!.postMessage(payload, window.location.origin);
        } finally {
          // Close the popup after posting the message
          setTimeout(() => window.close(), 0);
        }
      },

      async signInWithGoogle() {
        if (this.loading) return;
        this.loading = true;
        this.err = null;

        try {
          await this.authenticationStore.login();

          // Navigate to ?next=... or home
          const q = this.$route?.query?.next;
          const nextPath = Array.isArray(q) ? q[0] : q;
          await this.$router.push((nextPath as string) || '/');
        } catch {
          // Show friendly message from store if available
          this.err = this.authenticationStore.err || 'Login failed';
        } finally {
          this.loading = false;
        }
      },
    },

    mounted() {
      // Detect OAuth errors when this page is used as the popup redirect
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const error = params.get('error');
      const state = params.get('state');

      if (error && state === 'popup') {
        this.handlePopupError(error, params.get('error_description') ?? undefined);
        // Store raw (or map to friendly if you prefer):
        // this.authenticationStore.err = this.authenticationStore.getFriendlyErrorMessage
        //   ? this.authenticationStore.getFriendlyErrorMessage(error)
        //   : error;
        this.authenticationStore.err = error;
      }
    },
  });
</script>

<template>
  <main class="auth">
    <section class="card">
      <h1 class="title">Sign in</h1>

      <button class="gbtn" :disabled="loading" @click="signInWithGoogle">
        <img src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
        <span v-if="!loading">Continue with Google</span>
        <span v-else>Signing in…</span>
      </button>

      <div v-if="err" class="error" role="alert">
        <div class="error-title">{{ err }}</div>
      </div>
    </section>
  </main>
</template>

<style scoped>
  .auth {
    display: grid;
    place-items: center;
    min-height: calc(100dvh - 64px);
  }

  .card {
    background: #fff;
    border-radius: 12px;
    padding: 20px 16px;
    box-shadow: var(--shadow, 0 1px 2px rgba(0, 0, 0, 0.1));
    width: 80%;
    max-width: 360px;
    text-align: center;
  }

  .title {
    margin: 0 0 8px;
    font-weight: 800;
    font-size: 24px;
  }

  .sub {
    margin: 0 0 16px;
    color: #475569;
  }

  .gsi-anchor {
    display: inline-block;
  }

  .gbtn {
    margin: auto;
    font-weight: bold;
  }

  .gbtn img {
    height: 1.2em;
    vertical-align: middle;
    margin-right: 8px;
  }

  .gbtn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error {
    margin-top: 14px;
    padding: 12px;
    border-radius: 8px;
    background: #fee2e2;
    border: 1px solid #fecaca;
    text-align: left;
  }

  .error-title {
    color: #7f1d1d;
    font-weight: 800;
    margin: 0;
    text-align: center;
  }
</style>
