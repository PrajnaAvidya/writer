import Big from 'big.js';
import workerIndex from '@/utils/workerIndex';

export default {
  // currencies
  currency: {
    words: Big(0),
    money: Big(1),
    wordValue: Big(0.10),
  },

  // player words (clicking)
  playerWords: Big(1),

  // caffeine
  buzzActive: false,
  caffeineTime: 45,
  caffeineCooldown: 600,
  caffeineClickMultiplier: Big(2),
  caffeineWordGeneration: Big(2),
  nextCaffeineTime: 0,
  endCaffeineTime: 0,

  // jobs
  jobs: {},
  jobCooldown: 300,
  jobRewardMultiplier: Big(1),
  nextJobTime: 0,
  jobsGenerated: false,

  // workers
  buyAmount: 1,
  buyAmountIndex: 0,
  workers: {},
  workerQuantities: workerIndex(0),
  assignments: workerIndex(0),
  workerWps: Big(0),
  workerMps: Big(0),

  // upgrades
  upgrades: {},
  revealedUpgrades: {},

  // stats
  statistics: {
    words: Big(0),
    clickWords: Big(0),
    money: Big(0),
    moneySpent: Big(0),
    caffeines: Big(0),
    jobs: Big(0),
    upgrades: Big(0),
    totalUpgrades: Big(0),
  },
};
