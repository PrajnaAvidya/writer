import Big from 'big.js';
import workerIndex from '@/utils/workerIndex';

export default {
  // debug
  debugMode: false,
  debugStartingWords: Big(1E9),
  debugStartingMoney: Big(1E9),
  debugCaffeineCooldown: 5,
  debugJobCooldown: 5,

  playerName: '',

  // currencies
  currency: {
    words: Big(0),
    money: Big(1),
    wordValue: Big(0.10),
  },

  // player words (clicking)
  playerWords: Big(1),
  playerIcon: '',
  playerIcons: [],

  // caffeine
  buzzActive: false,
  caffeineTime: 30,
  caffeineCooldown: 600,
  caffeineClickMultiplier: Big(2),
  caffeineWordGeneration: Big(3),
  nextCaffeineTime: 0,
  endCaffeineTime: 0,

  // jobs
  jobs: {},
  jobsCompletedTimestamps: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  },
  jobsAvailableTimestamps: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  },
  jobCooldown: 120,
  jobRewardMultiplier: Big(1),

  // urgent jobs
  urgentJob: null,
  urgentJobActive: false,
  urgentJobTimestamp: null,
  urgentJobExpiration: null,
  urgentJobMinimumTime: 300,
  urgentJobMaximumTime: 900,
  urgentJobTimer: 60,
  urgentJobCountdown: 0,
  urgentJobRewardMultiplier: Big(1),

  // workers
  buyAmount: 1,
  buyAmountIndex: 0,
  workers: {},
  workerQuantities: workerIndex(0),
  assignments: workerIndex(0),
  workerWps: Big(0),
  workerMps: Big(0),
  individualWorkerWps: {},

  // upgrades
  upgrades: {},
  revealedUpgrades: {},

  // words
  adjectives: [],

  // stats
  statistics: {
    words: Big(0),
    clickWords: Big(0),
    money: Big(0),
    moneySpent: Big(0),
    caffeines: Big(0),
    workers: Big(0),
    jobs: Big(0),
    urgentJobs: Big(0),
    upgrades: Big(0),
    totalUpgrades: Big(0),
  },
};
