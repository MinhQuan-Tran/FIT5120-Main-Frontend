import { defineStore } from 'pinia';
import api from '@/api';

import { type User, AuthStatus } from '@/types/user';

const useAuthStore = defineStore('auth', {
  state: () => ({
    account: null as User | null,
    deviceID: null as string | null,
    // accessToken: '' as string,
  }),

  actions: {
    async init() {
      this.deviceID = localStorage.getItem('deviceID');
      if (!this.deviceID) {
        this.deviceID = crypto.randomUUID();
        localStorage.setItem('deviceID', this.deviceID);
      }

      this.login();
    },

    async login() {
      if (!this.deviceID) {
        console.warn('Device ID not found, re-initializing...');
        return this.init();
      }

      try {
        const response = await api.user.login({
          deviceid: this.deviceID,
          name: 'User1234',
        });

        this.account = {
          name: response.data.name,
          profilePictureURL:
            response.data.profile_picture_url ||
            `https://ui-avatars.com/api/?name=${response.data.name}&background=3b82f6&color=fff`,
        };

        // this.accessToken = response.token;
        console.log('Login successful:', response);
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    // async fetchToken() {
    //   if (!this.accessToken) throw new Error('Not logged in');
    //   console.log('Token fetched successfully');
    //   return this.accessToken;
    // },

    // async logout() {
    //   this.account = null;
    //   // this.accessToken = '';
    // },
  },

  getters: {
    status(): AuthStatus {
      return this.account ? AuthStatus.Authenticated : AuthStatus.Unauthenticated;
    },
  },
});

export default useAuthStore;
