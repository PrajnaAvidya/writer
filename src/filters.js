import Vue from 'vue';
import sortBy from 'lodash/sortBy';
import round from './utils/round';

Vue.filter('round', value => round(value));
Vue.filter('roundPositive', value => round(value, { alwaysPositive: true }));
Vue.filter('money', value => `$${round(value)}`);
Vue.filter('order', list => sortBy(list, ['order']));
