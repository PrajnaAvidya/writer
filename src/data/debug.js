import Big from 'big.js';

export default {
  enabled: false && process.env.NODE_ENV === 'development',
  disableUnfolding: false,
  urgentJobs: false,
  showAllUpgrades: false,
  books: false,
  rebirth: false,
  disableAutoSave: false,
  disableAutoLoad: true,
  // startingMilestones: Big(100),
  // startingWords: Big(1E100),
  // startingMoney: Big(1E100),
  // startingPlotPoints: Big(1500),
  // caffeineTime: 10,
  // caffeineCooldown: 300,
  // jobCooldown: 1,
};
