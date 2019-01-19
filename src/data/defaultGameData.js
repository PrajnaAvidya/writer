import Big from 'big.js';

export default {
  // currencies
  ideas: Big(0),
  words: Big(0),
  wordValue: Big(0.01),
  money: Big(0),
  reputation: Big(0),

  // jobs
  jobWords: Big(0),
  jobActive: false,

  // player ranges
  baseIdeas: Big(1),
  baseWrite: Big(1),
  maxWrite: Big(3),

  // caffeine
  coffeeCost: Big(1),
  caffeineTime: 120,
  caffeineMaxTime: 600,
  caffeineEndTime: -1,
  caffeineIdeaGeneration: Big(1),
  caffeineClickMultiplier: Big(2),

  // workers (generated)
  workers: {},

  // number of workers to buy
  buyAmount: 1,

  // upgrades (generated)
  upgrades: {},

  // used for tick function
  lastFrame: null,
};
