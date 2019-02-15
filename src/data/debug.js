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
  // startingPlayerWords: Big(100),
  // startingMilestones: Big(100),
  // startingWords: Big(1E100),
  // startingMoney: Big(1E100),
  // startingPlotPoints: Big(1500),
  // caffeineTime: 10,
  // caffeineCooldown: 300,
  // jobCooldown: 1,
};
