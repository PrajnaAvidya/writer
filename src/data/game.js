import Big from 'big.js';

export default {
  // tick
  lastFrame: 0,
  utimestamp: 0,
  haltAnimation: false,
  frameIncrement: 0,
  // currency display
  displayedWords: Big(0),
  displayedMoney: Big(0),
  // periodic checks
  lastJobCheck: 0,
  nextJobCheck: 0,
  nextMilestoneCheck: 0,
  nextTitleUpdate: 0,
  urgentJobNotification: null,
  // caffeine animation
  caffeineWordGeneration: Big(0),
  caffeineX: 0,
  caffeineY: 0,
  caffeineAnimationInterval: 1,
  caffeineAnimationAmount: Big(1),
  caffeineAnimationNext: 0,
  // unfolding
  loadFirstTutorial: false,
  unfoldingComponent: null,
  crazyBooksComponent: null,
  // particles
  particles: null,
  // save/load
  isNewGame: true,
  saveInterval: 30,
  nextSave: 0,
  unloadSave: false,
  hardResetting: false,
  // rebirth
  rebirthNotification: false,
};
