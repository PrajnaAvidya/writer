import Vue from 'vue';
import utils from './utils';

Vue.filter('round', value => utils.round(value));
Vue.filter('roundPositive', value => utils.round(value, { alwaysPositive: true }));
Vue.filter('money', value => `$${utils.round(value)}`);
