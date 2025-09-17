import { defineStore } from 'pinia';
import { SocialLogin, type GoogleLoginResponseOnline } from '@capgo/capacitor-social-login';
import { type User, AuthStatus } from '@/types/user';

const useAuthStore = defineStore('auth', {
  state: () => ({
    account: null as User | null,
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
        const idToken = (res.result as GoogleLoginResponseOnline).idToken as string | undefined;

        // Log id in development mode
        if (import.meta.env.DEV) {
          console.log('Google ID Token:', idToken);
        }

        if (!idToken) throw new Error('No idToken returned from Google');

        // Mock the user data for now
        this.account = {
          name: 'User1234', // Ideally, this would come from your backend
          profilePictureURL: `https://ui-avatars.com/api/?name=User1234&background=3b82f6&color=fff`,
        };

        console.log('Login successful');
      } catch (e) {
        this.err = 'Google login failed';
        console.error('Login failed', e);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.account = null;
      this.err = null;
      console.log('Logged out successfully');
    },
  },

  getters: {
    status(): AuthStatus {
      // Ignore auth status during development
      if (import.meta.env.DEV) return AuthStatus.Authenticated;

      return this.account ? AuthStatus.Authenticated : AuthStatus.Unauthenticated;
    },
  },
});

export default useAuthStore;
