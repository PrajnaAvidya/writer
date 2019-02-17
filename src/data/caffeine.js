import Big from 'big.js';

export default {
  // caffeine
  buzzActive: false,
  caffeineTime: 10,
  caffeineCooldown: 300,
  caffeineMinimumWordGeneration: Big(4),
  nextCaffeineTime: 0,
  endCaffeineTime: 0,
};
