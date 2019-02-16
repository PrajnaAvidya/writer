import Big from 'big.js';

export default {
  enabled: true && process.env.NODE_ENV === 'development',
  fastSaves: true,
  disableUnfolding: true,
  urgentJobs: false,
  showAllUpgrades: false,
  books: false,
  rebirth: false,
  disableAutoSave: false,
  disableAutoLoad: false,
  // startingPlayerWords: Big(0),
  // startingMilestones: Big(0),
  // startingWords: Big(0),
  // startingMoney: Big(1000),
  startingPlotPoints: Big(1500),
  // caffeineTime: 10,
  // caffeineCooldown: 1,
  // jobCooldown: 1,
};
