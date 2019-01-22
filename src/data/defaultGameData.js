import Big from 'big.js';

export default {
  // currencies
  ideas: Big(0),
  words: Big(0),
  wordValue: Big(0.01),
  money: Big(0),

  // unfolding
  showCaffeine: true,
  showJobs: true,
  showProduction: true,
  showUpgrades: true,

  // player ranges
  baseIdeas: Big(1),
  baseWrite: Big(1),
  maxWrite: Big(3),

  // caffeine
  coffeeCost: Big(0.5),
  caffeineTime: 30,
  caffeineMaxTime: 300,
  caffeineEndTime: -1,
  caffeineIdeaGeneration: Big(0.5),
  caffeineClickMultiplier: Big(2),

  // jobs
  jobTimer: 60,

  // workers (generated)
  workers: {},
  workerProductivityMultipliers: {},
  workerEfficiencyMultipliers: {},
  assignments: {
    child: 0,
    student: 0,
    grad: 0,
  },

  // upgrades (generated)
  upgrades: {},

  // used for tick function
  lastFrame: null,
};
