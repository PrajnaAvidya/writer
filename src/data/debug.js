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
  // startingWords: Big(0),
  // startingMoney: Big(0),
  // startingPlotPoints: Big(0),
  // caffeineTime: 10,
  // caffeineCooldown: 300,
  // jobCooldown: 60,
};
