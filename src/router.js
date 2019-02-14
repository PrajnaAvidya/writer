import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/workers',
      name: 'Workers',
      component: () => import('@/views/Workers.vue'),
    },
    {
      path: '/jobs',
      name: 'Jobs',
      component: () => import('@/views/Jobs.vue'),
    },
    {
      path: '/upgrades',
      name: 'Upgrades',
      component: () => import('@/views/Upgrades.vue'),
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('@/views/Stats.vue'),
    },
    {
      path: '/rebirth',
      name: 'Rebirth',
      component: () => import('@/views/Rebirth.vue'),
    },
    {
      path: '/bonus',
      name: 'Bonus',
      component: () => import('@/views/Bonus.vue'),
    },
    {
      path: '/options',
      name: 'Options',
      component: () => import('@/views/Options.vue'),
    },
  ],
});

// track navigation in google analytics
router.afterEach(() => {
  Vue.$ga.page(router);
});

export default router;
