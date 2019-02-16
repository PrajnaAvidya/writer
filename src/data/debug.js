import Big from 'big.js';

export default {
  enabled: false && process.env.NODE_ENV === 'development',
  fastSaves: false,
  disableUnfolding: false,
  urgentJobs: false,
  showAllUpgrades: false,
  books: false,
  rebirth: false,
  disableAutoSave: false,
  disableAutoLoad: false,
  // startingPlayerWords: Big(0),
  // startingMilestones: Big(0),
  // startingWords: Big(1E9),
  // startingMoney: Big(102),
  // startingPlotPoints: Big(2000),
  // caffeineTime: 10,
  // caffeineCooldown: 1,
  // jobCooldown: 20,
};
