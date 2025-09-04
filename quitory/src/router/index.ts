import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

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

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    if (authStore.status === AuthStatus.Unauthenticated) {
      try {
        await authStore.login();
      } catch (error) {
        console.error('Login failed:', error);
        return next({ name: 'Home' });
      }
    }
  }

  return next();
});

export default router;
