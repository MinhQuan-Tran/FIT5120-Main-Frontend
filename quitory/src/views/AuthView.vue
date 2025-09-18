<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import useAuthStore from '@/stores/authStore';

  // TODO: Fix error handling for popup
  // TODO: Convert to Options API

  export default defineComponent({
    name: 'AuthView',

    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const loading = ref(false);
      const err = ref<string | null>(null);

      // Function to handle sending error back to the opener (if this is a popup)
      const handlePopupError = (error: string, errorDescription?: string) => {
        const isPopup = window.opener && window.opener !== window; // check if it's a popup
        if (isPopup) {
          const payload = {
            source: 'oauth-popup',
            provider: 'google',
            ok: false,
            error: error,
            error_description: errorDescription,
          };
          // Send the error to the parent window
          window.opener.postMessage(payload, window.location.origin);
          // window.close(); // Close the popup after sending the message
        }
      };

      // Check if the URL contains an error from the Google sign-in process
      onMounted(() => {
        const urlParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        // if (error && state === 'popup') {
        //   authStore.err = error;
        //   handlePopupError(error, urlParams.get('error_description') ?? undefined);
        // }
      });

      // Sign-in function triggering login via authStore
      const signInWithGoogle = async () => {
        loading.value = true;
        err.value = null;

        try {
          // Trigger the login from authStore
          await authStore.login();

          // After successful login, navigate to the next path or home
          const next = router.currentRoute.value.query.next;
          const nextPath = Array.isArray(next) ? next[0] : next;
          router.push((nextPath as string) || '/');
        } catch {
          // Handle any error that occurs during login
          err.value = authStore.err || 'Login failed';
        } finally {
          loading.value = false;
        }
      };

      return {
        signInWithGoogle,
        loading,
        err,
      };
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
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
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
