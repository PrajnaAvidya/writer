import Big from 'big.js';

export default {
  // caffeine
  buzzActive: false,
  caffeineTime: 10,
  caffeineCooldown: 300,
  caffeineClickMultiplier: Big(2),
  caffeineWordMultiplier: Big(1),
  caffeineMinimumWordGeneration: Big(5),
  nextCaffeineTime: 0,
  endCaffeineTime: 0,
};
