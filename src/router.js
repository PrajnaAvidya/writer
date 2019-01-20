import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/workers',
      name: 'workers',
      component: () => import('./views/Workers.vue'),
    },
    {
      path: '/agency',
      name: 'agency',
      component: () => import('./views/Agency.vue'),
    },
    {
      path: '/upgrades',
      name: 'upgrades',
      component: () => import('./views/Upgrades.vue'),
    },
  ],
});
