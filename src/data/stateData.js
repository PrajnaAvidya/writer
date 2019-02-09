// load the big game data object that gets stored in vuex/local state

import Big from 'big.js';
import shuffle from 'lodash/shuffle';
import workers from '@/data/workers';
import upgrades from '@/data/upgrades';
import workerIndex from '@/data/workers/workerIndex';
import playerIcons from '@/data/playerIcons';
import tutorials from '@/data/tutorials';
import milestones from '@/data/milestones';

const data = {
  // tutorials
  tutorials: [],

  // currencies
  currency: {
    words: Big(10000),
    money: Big(10000),
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

  // writing icons
  stateData.playerIcons = playerIcons.reverse();
  stateData.playerIcon = stateData.playerIcons.pop();

  // workers
  stateData.workers = workers();

  // upgrades
  stateData.upgrades = upgrades();
  stateData.upgradeId = Object.keys(stateData.upgrades)[Object.keys(stateData.upgrades).length - 1];

  // tutorials/unfolding
  stateData.tutorials = tutorials.reverse();

  return stateData;
}
