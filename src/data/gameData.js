// load the big game data object that gets stored in vuex/local state

import Big from 'big.js';
import shuffle from 'lodash/shuffle';
import generateWorkerData from '@/utils/generateWorkerData';
import generateUpgrades from '@/utils/generateUpgrades';
import workerIndex from '@/utils/workerIndex';
import adjectives from '@/data/adjectives';
import playerIcons from '@/data/playerIcons';
import tutorials from '@/data/tutorials';
import milestones from '@/data/milestones';

const data = {
  debug: {
    enabled: true,
    fastTutorials: true,
    disableTutorials: true,
    disableUnfolding: true,
    urgentJobs: false,
    startingWords: Big(1E6),
    startingMoney: Big(1E6),
    caffeineTime: 10,
    caffeineCooldown: 10,
    jobCooldown: 1,
  },

  // name
  // playerName: 'Rafiq',

  // tutorials
  tutorials: [],

  // currencies
  currency: {
    words: Big(0),
    money: Big(1),
    wordValue: Big(0.10),
  },

  // worker + caffeine wps (displayed)
  totalWps: Big(0),

  // player words (clicking)
  playerWords: Big(1),
  playerIcon: '',
  playerIcons: [],

  // caffeine
  buzzActive: false,
  caffeineTime: 10,
  caffeineCooldown: 300,
  caffeineClickMultiplier: Big(2),
  caffeineWordGeneration: Big(5),
  nextCaffeineTime: 0,
  endCaffeineTime: 0,
  // caffeine animation

  // jobs
  jobSlots: 1,
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
  jobCooldown: 300,
  jobRewardMultiplier: Big(1),
  jobAvailable: {},

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
  workerWps: Big(0),
  totalMps: Big(0),
  individualWorkerWps: {},
  workerTooltips: {},

  // upgrades
  upgrades: {},
  revealedUpgrades: {},
  purchasedUpgrades: [],

  // random words
  adjectives: [],

  // unfolding
  showMoney: false,
  showWps: false,
  showNavigation: false,
  showCoffee: false,
  showJobs: false,
  showWorkers: false,
  showUpgrades: false,
  showStats: false,
  firstJobComplete: false,
  firstUrgentJobComplete: false,
};

const stats = {
  words: 'Words Written',
  clickWords: 'Words Written from Clicks',
  money: 'Money Made',
  moneySpent: 'Money Spent',
  caffeines: 'Coffees Drank',
  workers: 'Workers Hired',
  jobs: 'Jobs Complete',
  urgentJobs: 'Urgent Jobs Complete',
  upgrades: 'Upgrades Bought',
};

export default function () {
  const gameData = Object.assign({}, data);

  // generate stats
  gameData.statistics = {};
  gameData.statDescriptions = {};
  Object.keys(stats).forEach((stat) => {
    gameData.statistics[stat] = Big(0);
    gameData.statDescriptions[stat] = stats[stat];
  });

  // generate first set of milestones
  gameData.milestones = {};
  Object.keys(milestones).forEach((stat) => {
    gameData.milestones[stat] = milestones[stat].base;
  });

  // adjectives
  gameData.adjectives = shuffle(adjectives);

  // writing icons
  gameData.playerIcons = playerIcons.reverse();
  gameData.playerIcon = gameData.playerIcons.pop();

  // workers & upgrades
  gameData.workers = generateWorkerData();
  gameData.upgrades = generateUpgrades(gameData.adjectives);

  // get total # of upgrades for %
  gameData.statistics.totalUpgrades = Object.keys(gameData.upgrades).length;

  // tutorials/unfolding
  gameData.tutorials = tutorials.reverse();

  return gameData;
}
