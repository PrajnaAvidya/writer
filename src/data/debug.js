import Big from 'big.js';

export default {
  enabled: true && process.env.NODE_ENV === 'development',
  fastSaves: true,
  disableUnfolding: true,
  urgentJobs: false,
  showAllUpgrades: false,
  books: false,
  rebirth: true,
  disableAutoSave: false,
  disableAutoLoad: true,
  // startingPlayerWords: Big(0),
  // startingMilestones: Big(0),
  // startingWords: Big(1E9),
  startingMoney: Big(102),
  // startingPlotPoints: Big(2000),
  // caffeineTime: 10,
  // caffeineCooldown: 1,
  jobCooldown: 20,
};
