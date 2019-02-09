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
import bonuses from '@/data/bonuses';

const data = {
  debug: {
    enabled: true,
    fastTutorials: false,
    disableTutorials: false,
    disableUnfolding: true,
    urgentJobs: false,
    books: false,
    startingWords: Big(1000000),
    startingMoney: Big(1000000),
    startingPlotPoints: Big(1000),
    caffeineTime: 10,
    caffeineCooldown: 300,
    jobCooldown: 1,
  },

  // tutorials
  tutorials: [],

  // currencies
  currency: {
    words: Big(10000),
    money: Big(10000),
    wordValue: Big(0.10),
    milestones: Big(0),
  },

  // rebirth
  rebirth: {
    baseMilestonesNeeded: Big(20),
    rebirths: Big(0),
    plotPoints: Big(0),
    bonuses: {
      jobSlots: 1,
    },
    lockedBonuses: {},
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
  maxJobSlots: 5,
  jobs: {},
  jobsCompletedTimestamps: {},
  jobsAvailableTimestamps: {},
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
  const stateData = Object.assign({}, data);

  // generate stats
  stateData.statistics = {};
  stateData.statDescriptions = {};
  Object.keys(stats).forEach((stat) => {
    stateData.statistics[stat] = Big(0);
    stateData.statDescriptions[stat] = stats[stat];
  });

  // generate first set of milestones
  stateData.milestones = {};
  stateData.milestoneCount = {};
  Object.keys(milestones).forEach((stat) => {
    stateData.milestones[stat] = Big(milestones[stat].base);
    stateData.milestoneCount[stat] = 0;
  });

  // adjectives
  stateData.adjectives = shuffle(adjectives);

  // writing icons
  stateData.playerIcons = playerIcons.reverse();
  stateData.playerIcon = stateData.playerIcons.pop();

  // workers
  stateData.workers = workers();

  // upgrades
  stateData.upgrades = upgrades(stateData.adjectives);
  stateData.upgradeId = Object.keys(stateData.upgrades)[Object.keys(stateData.upgrades).length - 1];

  // jobs
  for (let id = 1; id <= stateData.maxJobSlots; id += 1) {
    stateData.jobsCompletedTimestamps[id] = 0;
    stateData.jobsAvailableTimestamps[id] = 0;
  }

  // bonuses
  stateData.rebirth.lockedBonuses = Object.assign({}, bonuses);

  // tutorials/unfolding
  stateData.tutorials = tutorials.reverse();

  return stateData;
}
