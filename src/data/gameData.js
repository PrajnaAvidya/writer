// load the big game data object that gets stored in vuex/local state

import Big from 'big.js';
import shuffle from 'lodash/shuffle';
import workers from '@/data/workers';
import upgrades from '@/data/upgrades';
import workerIndex from '@/data/workers/workerIndex';
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
    books: true,
    startingWords: Big(0),
    startingMoney: Big(0),
    caffeineTime: 10,
    caffeineCooldown: 300,
    jobCooldown: 1,
  },

  // tutorials
  tutorials: [],

  // currencies
  currency: {
    words: Big(0),
    money: Big(1),
    wordValue: Big(0.10),
    milestones: Big(0),
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
  maxJobSlots: 4,
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
  jobCooldown: 60,
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
  upgradeId: 0,
  upgrades: {},
  revealedUpgrades: {},
  purchasedUpgrades: [],

  // random words
  adjectives: [],

  // clickables
  bookActive: false,
  bookPosition: {
    x: 0,
    y: 0,
  },
  nextBookTime: 0,
  bookExpireTime: 0,
  bookMinimumTime: 300,
  bookMaximumTime: 900,
  bookSpawnTime: 60,

  // unfolding
  unfolding: {
    showMoney: false,
    showWps: false,
    showNavigation: false,
    showCoffee: false,
    showJobs: false,
    showWorkers: false,
    showUpgrades: false,
    showStats: false,
    showRebirth: false,
    firstJobComplete: false,
    firstUrgentJobComplete: false,
  },
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
  clickables: 'Books Clicked',
  /*
  wordsHad: 'Most Words Had At Once',
  moneyHad: 'Most Money Had At Once',
  */
  wps: 'Highest Words Per Second',
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
  gameData.milestoneCount = {};
  Object.keys(milestones).forEach((stat) => {
    gameData.milestones[stat] = Big(milestones[stat].base);
    gameData.milestoneCount[stat] = 0;
  });

  // adjectives
  gameData.adjectives = shuffle(adjectives);

  // writing icons
  gameData.playerIcons = playerIcons.reverse();
  gameData.playerIcon = gameData.playerIcons.pop();

  // workers
  gameData.workers = workers();

  // upgrades
  gameData.upgrades = upgrades(gameData.adjectives);
  gameData.upgradeId = Object.keys(gameData.upgrades)[Object.keys(gameData.upgrades).length - 1];

  // tutorials/unfolding
  gameData.tutorials = tutorials.reverse();

  return gameData;
}
