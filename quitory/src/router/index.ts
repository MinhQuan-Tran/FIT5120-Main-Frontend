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
      path: '/progress',
      name: 'Progress',
      component: () => import('@/views/ProgressView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: '/peer-support',
    //   name: 'Peer Support',
    //   component: () => import('@/views/PeerSupportView.vue'),
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('@/views/AboutView.vue'),
    // },
  ],
});

router.beforeEach(async (to) => {
  // Base security for project team, teaching team and IMs
  if (sessionStorage.getItem('isBaseAuthenticated') === 'true') return true;

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

  // Authentication check
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (authStore.status === AuthStatus.Unauthenticated) {
      try {
        await authStore.login();
      } catch (error) {
        console.error('Login failed:', error);
        return {
          name: 'Home',
        };
      }
    }
  }

  return true;
});

export default router;
