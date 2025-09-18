import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

import isPasswordValid from '@/utils/authGate';

import useAuthStore from '@/stores/authStore';
import { AuthStatus } from '@/types/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('@/views/AuthView.vue'),
    },
    {
      path: '/progress',
      name: 'Progress',
      component: () => import('@/views/ProgressView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/journey',
      name: 'Journey',
      component: () => import('@/views/JourneyView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/session',
      name: 'Session',
      component: () => import('@/views/SessionView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/help-me-now',
      name: 'HelpMeNow',
      component: () => import('@/views/HelpMeNowView.vue'),
    },
    {
      path: '/cravings/log',
      name: 'CravingLog',
      component: () => import('@/views/CravingLogView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to) => {
  // Base security for project team, teaching team and IMs
  if (sessionStorage.getItem('isBaseAuthenticated') !== 'true') {
    // Prompt until correct or user cancels
    for (;;) {
      const password = prompt('Password:');
      if (!password) return false; // user hit cancel

      const isValid = await isPasswordValid(
        password,
        import.meta.env.VITE_API_BASE_AUTH_PASSWORD as string,
      );

      if (isValid) {
        sessionStorage.setItem('isBaseAuthenticated', 'true');
        alert('Access granted.');
        break;
      }

      alert('Incorrect password.');
      // loop again; user can cancel to bail out
    }
  }

  // Authentication check
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();

    console.log('Auth status:', authStore.status);

    if (authStore.status === AuthStatus.Unauthenticated) {
      return {
        name: 'Auth',
      };
    }
  }

  return true;
});

export default router;
