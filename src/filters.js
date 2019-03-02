import Vue from 'vue';
import sortBy from 'lodash/sortBy';
import round from '@/utils/round';

Vue.filter('round', value => round(value));
Vue.filter('roundDecimal', value => `${round(value, { decimal: true })}`);
Vue.filter('roundPositive', value => round(value, { alwaysPositive: true }));
Vue.filter('roundPercent', value => round(value, { percentFormat: true }));
Vue.filter('money', value => `$${round(value)}`);
Vue.filter('moneyCents', value => `$${round(value, { decimal: true })}`);
Vue.filter('orderCost', list => sortBy(list, item => parseInt(item.cost.toFixed(), 10)));
