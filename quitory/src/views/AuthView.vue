<script lang="ts">
  import { defineComponent } from 'vue';
  import { SocialLogin, type GoogleLoginResponseOnline } from '@capgo/capacitor-social-login';

  type PopupMessage = {
    source: 'oauth-popup';
    provider: 'google';
    ok: false;
    error: string;
    error_description?: string;
  };

  export default defineComponent({
    name: 'AuthView',

    data() {
      return {
        loading: false as boolean,
        err: null as string | null,
        inited: false as boolean,
        gotPopupError: false as boolean,
      };
    },

    computed: {
      enviroment(): string {
        return import.meta.env.MODE;
      },

      verifyUrl(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/auth/google/verify`;
      },

      nextPath(): string {
        const q = this.$route?.query?.next;
        return typeof q === 'string' && q.startsWith('/') ? q : '/';
      },

      myOrigin(): string {
        return window.location.origin;
      },
    },

    methods: {
      async ensureInit() {
        if (this.inited) return;
        await SocialLogin.initialize({
          google: {
            webClientId: import.meta.env.VITE_GSI_CLIENT_ID as string,
            mode: 'online',
          },
        });
        this.inited = true;
      },

      parseHashParams(hash: string): Record<string, string> {
        const q = hash.replace(/^#/, '');
        if (!q) return {};
        const out: Record<string, string> = {};
        for (const part of q.split('&')) {
          if (!part) continue;
          const [k, v = ''] = part.split('=');
          out[decodeURIComponent(k)] = decodeURIComponent(v);
        }
        return out;
      },

      toFriendlyMessage(codeOrMsg: string): string {
        const code = (codeOrMsg || '').toLowerCase();

        if (code.includes('access_denied')) return 'Sign-in was cancelled.';
        if (code.includes('popup closed')) return 'Sign-in window was closed.';
        if (code.includes('interaction_required')) return 'Action needed to continue.';
        if (code.includes('login_required')) return 'Please sign in to Google first.';
        if (code.includes('consent_required')) return 'Permission required.';
        if (code.includes('invalid_scope')) return 'Invalid permission request.';
        if (code.includes('server_error') || code.includes('temporarily_unavailable'))
          return 'Google is temporarily unavailable.';
        if (code.includes('reauth failed') || code.includes('[16]'))
          return 'Please re-authenticate your Google account.';

        return 'We couldn’t complete Google sign-in.';
      },

      // If this is the popup with an OAuth error hash, post it to opener and close.
      handlePopupErrorRelay(): boolean {
        const isPopup = !!(window.opener && window.opener !== window);
        if (!isPopup) return false;

        const params = this.parseHashParams(window.location.hash || '');
        const hasError = typeof params.error === 'string' && params.error.length > 0;
        const isPopupState = params.state === 'popup' || !params.state;

        if (!hasError || !isPopupState) return false;

        const payload: PopupMessage = {
          source: 'oauth-popup',
          provider: 'google',
          ok: false,
          error: params.error,
          error_description: params.error_description,
        };

        try {
          window.opener!.postMessage(payload, this.myOrigin);
        } finally {
          setTimeout(() => window.close(), 0);
          document.body.innerHTML =
            '<p style="font:14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin:24px; text-align:center;">You can close this window.</p>';
        }

        return true;
      },

      onPopupMessage(e: MessageEvent) {
        if (e.origin !== this.myOrigin) return;
        const data = e.data as PopupMessage;
        if (!data || data.source !== 'oauth-popup' || data.provider !== 'google') return;

        this.gotPopupError = true;
        this.err = this.toFriendlyMessage(data.error);
      },

      async signInWithGoogle(
        onSuccess?: (payload: { idToken: string }) => void,
        onError?: (e: unknown) => void,
      ) {
        if (this.loading) return;
        this.loading = true;
        this.err = null;
        this.gotPopupError = false;

        try {
          await this.ensureInit();

          const res = await SocialLogin.login({ provider: 'google', options: {} });
          const idToken = (res.result as GoogleLoginResponseOnline)?.idToken as string | undefined;
          if (!idToken) throw new Error('No idToken returned from Google');

          // Log id in development mode
          if (import.meta.env.DEV) {
            console.log('Google ID Token:', idToken);
          }

          const r = await fetch(this.verifyUrl, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: idToken, state: this.nextPath }),
          });
          if (!r.ok) {
            const body = await r.text().catch(() => '');
            throw new Error(`Verify failed: ${r.status} ${body}`);
          }

          if (onSuccess) onSuccess({ idToken });
          await this.$router.replace(this.nextPath);
        } catch (e: unknown) {
          const raw = (e as Error)?.message || String(e);

          if (this.gotPopupError && /popup closed/i.test(raw)) {
            // err already set by onPopupMessage
          } else {
            this.err = this.toFriendlyMessage(raw);
          }

          if (onError) onError(e);
        } finally {
          this.loading = false;
        }
      },

      handleSuccess() {
        console.log('[Auth] Google verified, session established');
      },

      handleError(e: unknown) {
        console.error('[Auth] Google sign-in failed', e);
      },
    },

    async mounted() {
      if (this.handlePopupErrorRelay()) return;

      window.addEventListener('message', this.onPopupMessage);

      try {
        await this.ensureInit();
      } catch (e) {
        console.warn('SocialLogin init warning:', e);
      }
    },

    beforeUnmount() {
      window.removeEventListener('message', this.onPopupMessage);
    },
  });
</script>

<template>
  <main class="auth">
    <section class="card">
      <h1 class="title">Sign in</h1>

      <br />

      <button
        class="gbtn"
        :disabled="loading"
        @click="signInWithGoogle(handleSuccess, handleError)"
      >
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
  }

  .card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    width: 80%;
    max-width: 380px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .title {
    margin: 0 0 6px;
    font-size: 24px;
    font-weight: 800;
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
