import { defineStore } from 'pinia';
import { SocialLogin, type GoogleLoginResponseOnline } from '@capgo/capacitor-social-login';
import api from '@/api';

import { type User, AuthStatus } from '@/types/user';

const useAuthStore = defineStore('authentication', {
  state: () => ({
    user: null as User | null,
    idToken: null as string | null,
    loading: false as boolean,
    err: null as string | null,
  }),

  actions: {
    async init() {
      // Initialize social login service (Google for example)
      await SocialLogin.initialize({
        google: {
          webClientId: import.meta.env.VITE_GSI_CLIENT_ID as string,
          mode: 'online',
        },
      });
    },

    fetchToken(): Promise<string | null> {
      // TODO: retrieve and return a valid auth token here
      return Promise.resolve(this.idToken);
    },

    async login() {
      if (this.loading) return;

      this.loading = true;
      this.err = null;

      try {
        // Perform Google login using the capacitor social login plugin
        const res = await SocialLogin.login({ provider: 'google', options: {} });
        const idToken = (res.result as GoogleLoginResponseOnline)?.idToken as string | null;

        if (!idToken) throw new Error('No idToken returned from Google');

        this.idToken = idToken;

        await api.user
          .login()
          .then((data) => {
            if (import.meta.env.DEV) console.log('Login API response:', data);

            const user = data.data;

            if (!user || !user.id || !user.name) {
              throw new Error('Invalid user data from login API');
            }

            this.user = {
              id: String(user.id),
              name: String(user.name),
              profilePictureURL: `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`,
            };

            if (import.meta.env.DEV) console.log('Logged in successfully:', this.user);

            this.loading = false;
          })
          .catch((apiError) => {
            console.error('Login API error:', apiError);
            throw apiError;
          });
      } catch (error) {
        this.err = this.getFriendlyErrorMessage(
          error instanceof Error ? error.message : 'Google login failed',
        );
        this.loading = false;
        throw error; // propagate error to be handled in AuthView
      }
    },

    logout() {
      this.user = null;
      this.idToken = null;
      this.err = null;
      if (import.meta.env.DEV) console.log('Logged out successfully');
    },

    // Function to map error codes to user-friendly messages
    getFriendlyErrorMessage(codeOrMsg: string): string {
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
  },

  getters: {
    status(): AuthStatus {
      // Ignore auth status during development
      if (import.meta.env.DEV) return AuthStatus.Authenticated;

      return this.user ? AuthStatus.Authenticated : AuthStatus.Unauthenticated;
    },
  },
});

export default useAuthStore;
