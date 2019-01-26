import Big from 'big.js';
import workerIndex from '@/utils/workerIndex';

export default {
  // currencies
  ideas: Big(0),
  words: Big(0),
  wordValue: Big(0.01),
  money: Big(1000000),

  // player ranges
  playerIdeas: Big(1),
  playerWords: Big(1),

  // caffeine
  caffeineTime: 5,
  caffeineCooldown: 600,
  caffeineEndTime: -1,
  caffeineNextAvailable: -1,
  caffeineIdeaGeneration: Big(2),
  caffeineClickMultiplier: Big(2),

  // jobs
  jobCooldown: 300,
  jobRewardMultiplier: Big(1),

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
