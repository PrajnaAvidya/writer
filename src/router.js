import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/workers',
      name: 'Workers',
      component: () => import('./views/Workers.vue'),
    },
    {
      path: '/agency',
      name: 'Agency',
      component: () => import('./views/Agency.vue'),
    },
    {
      path: '/upgrades',
      name: 'Upgrades',
      component: () => import('./views/Upgrades.vue'),
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('./views/Stats.vue'),
    },
  ],
});
