import Vue from 'vue';
import utils from './utils';

Vue.filter('round', value => utils.round(value));
