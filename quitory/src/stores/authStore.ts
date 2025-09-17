import { defineStore } from 'pinia';
import { SocialLogin, type GoogleLoginResponseOnline } from '@capgo/capacitor-social-login';
import { type User, AuthStatus } from '@/types/user';
import api from '@/api';

const useAuthStore = defineStore('auth', {
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

    async login() {
      if (this.loading) return;

      this.loading = true;
      this.err = null;

      try {
        // Sign in using Google
        const res = await SocialLogin.login({ provider: 'google', options: {} });
        this.idToken = (res.result as GoogleLoginResponseOnline).idToken as string | null;

        // Log id in development mode
        if (import.meta.env.DEV) {
          console.log('Google ID Token:', this.idToken);
        }

        if (!this.idToken) throw new Error('No idToken returned from Google');

        await api.user.login().then((data) => {
          console.log('Logged in user:', data);
          this.user = data.data;
        });
      } catch (e) {
        this.err = 'Google login failed';
        console.error('Login failed', e);
      } finally {
        this.loading = false;
      }
    },

    fetchToken(): Promise<string | null> {
      // In a real app, you would retrieve and return a valid auth token here
      return Promise.resolve(this.idToken);
    },

    logout() {
      this.user = null;
      this.err = null;
      console.log('Logged out successfully');
    },
  },

  getters: {
    status(): AuthStatus {
      // Ignore auth status during development
      // if (import.meta.env.DEV) return AuthStatus.Authenticated;

      return this.user ? AuthStatus.Authenticated : AuthStatus.Unauthenticated;
    },
  },
});

export default useAuthStore;
