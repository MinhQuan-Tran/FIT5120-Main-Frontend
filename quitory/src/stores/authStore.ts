// src/stores/auth.ts
import { defineStore } from 'pinia';
import type User from '@/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // msalInstance: null as PublicClientApplication | null,
    account: null as User | null,
    accessToken: '' as string,
  }),

  actions: {
    async init() {},

    async login() {
      this.account = {
        id: 'user-id',
        displayName: 'User Name',
        email: 'user@example.com',
        photoURL: 'https://example.com/photo.jpg',
      } as User;

      this.accessToken = 'sample-access-token';

      console.log('Login successful');
    },

    async fetchToken() {
      if (!this.accessToken) throw new Error('Not logged in');
      console.log('Token fetched successfully');
      return this.accessToken;
    },

    async logout() {
      this.account = null;
      this.accessToken = '';
    },
  },

  getters: {
    status: () => {
      return 'authenticated';
    },
  },
});
