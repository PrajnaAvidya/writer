import Big from 'big.js';

export default {
  // currencies
  ideas: Big(0),
  words: Big(0),
  money: Big(2000),
  reputation: Big(20),

  // jobs
  jobWords: Big(0),
  jobActive: false,

  // player writing range
  baseWrite: Big(1),
  maxWrite: Big(3),

  // caffeine
  caffeineTime: 60,
  caffeineMaxTime: 300,
  caffeineEndTime: -1,
  caffeineMultiplier: Big(1),

  // workers (generated)
  workers: {},

  // number of workers to buy
  buyAmount: 1,

  // upgrades (generated)
  upgrades: {},

  // used for tick function
  lastFrame: null,
};
