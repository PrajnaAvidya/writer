import Big from 'big.js';
import workerIndex from '../utils/workerIndex';

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
  assignments: workerIndex(0),

  // upgrades (generated)
  upgrades: {},

  // stats
  newIdeas: Big(0),
  newWords: Big(0),
  newClickIdeas: Big(0),
  newClickWords: Big(0),

  // used for tick function
  lastFrame: 0,
  nextStatUpdate: 0,
};
