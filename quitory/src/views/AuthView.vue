<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { SocialLogin, type GoogleLoginResponseOnline } from '@capgo/capacitor-social-login';
  import { Capacitor } from '@capacitor/core';

  // ---- UI state
  const loading = ref(false);
  const err = ref<string | null>(null);
  const isNative = Capacitor.isNativePlatform?.();

  // ---- Env
  const verifyUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google/verify`;

  // ---- Routing
  const route = useRoute();
  const router = useRouter();
  const nextPath =
    typeof route.query.next === 'string' && route.query.next.startsWith('/')
      ? route.query.next
      : '/';

  // ---- One-time plugin init
  let inited = false;
  async function ensureInit() {
    if (inited) return;
    await SocialLogin.initialize({
      google: {
        webClientId: import.meta.env.VITE_GSI_CLIENT_ID,
        mode: 'online', // we want an idToken to send to backend
      },
    });
    inited = true;
  }

  async function resetGoogleSession() {
    try {
      await SocialLogin.logout({ provider: 'google' });
    } catch {}
  }

  // ---- Callback-based sign-in (no redirect). Consumers can pass callbacks.
  async function signInWithGoogle(
    onSuccess?: (payload: { idToken: string }) => void,
    onError?: (e: unknown) => void,
  ) {
    loading.value = true;
    err.value = null;
    try {
      await ensureInit();

      await resetGoogleSession();

      const res = await SocialLogin.login({ provider: 'google', options: {} });
      const idToken = (res.result as GoogleLoginResponseOnline).idToken as string | undefined;
      if (!idToken) throw new Error('No idToken returned from Google');

      // POST to your backend to verify & set HttpOnly session cookie
      const r = await fetch(verifyUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: idToken, state: nextPath }),
      });
      if (!r.ok) {
        const body = await r.text().catch(() => '');
        throw new Error(`Verify failed: ${r.status} ${body}`);
      }

      // Fire success callback first (so parent can react/log if needed)
      onSuccess?.({ idToken });

      // Navigate inside the app (still no page reload)
      await router.replace(nextPath);
    } catch (e: any) {
      err.value = e?.message || String(e);
      onError?.(e);
    } finally {
      loading.value = false;
    }
  }

  // Example: local callbacks (optional)
  // You can also trigger signInWithGoogle() without passing these.
  function handleSuccess(_: { idToken: string }) {
    // tip: don’t store the token; backend already created the session.
    console.log('[Auth] Google verified, session established');
  }
  function handleError(e: unknown) {
    console.error('[Auth] Google sign-in failed', e);
  }

  onMounted(async () => {
    // Best-effort init (login() will init if needed)
    try {
      await ensureInit();
    } catch (e) {
      console.warn('SocialLogin init warning:', e);
    }
  });
</script>

<template>
  <main class="auth">
    <section class="card">
      <h1 class="title">Sign in</h1>
      <p class="sub">
        Google (Capacitor 7, callback flow)
        <span v-if="isNative" class="badge">Native</span>
      </p>

      <button
        class="gbtn"
        :disabled="loading"
        @click="signInWithGoogle(handleSuccess, handleError)"
      >
        <span v-if="!loading">Continue with Google</span>
        <span v-else>Signing in…</span>
      </button>

      <p v-if="err" class="error">{{ err }}</p>
    </section>
  </main>
</template>

<style scoped>
  .auth {
    display: grid;
    place-items: center;
    min-height: 100dvh;
  }
  .card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
  }
  .title {
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 800;
  }
  .sub {
    margin: 0 0 16px;
    color: #475569;
  }
  .badge {
    margin-left: 8px;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 999px;
    background: #eef2ff;
    color: #3730a3;
  }
  .gbtn {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    font-weight: 600;
  }
  .gbtn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .error {
    color: #b91c1c;
    margin-top: 12px;
    word-break: break-word;
  }
</style>
