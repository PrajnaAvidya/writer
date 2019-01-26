import Big from 'big.js';
import workerIndex from '@/utils/workerIndex';

export default {
  // currencies
  words: Big(0),
  wordValue: Big(0.01),
  money: Big(1000000),

  // player ranges
  playerWords: Big(1),

  // caffeine
  caffeineTime: 30,
  caffeineCooldown: 600,
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
  newWords: Big(0),
  newClickWords: Big(0),

  // used for tick function
  lastFrame: 0,
  nextStatUpdate: 0,
};
