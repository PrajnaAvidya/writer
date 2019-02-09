import Big from 'big.js';

const gameData = {
  haltAnimation: false,
  lastFrame: 0,
  utimestamp: 0,
  nextJobCheck: 0,
  nextMilestoneCheck: 0,
  nextTitleUpdate: 0,

  displayedWords: Big(0),
  displayedMoney: Big(0),

  newWords: Big(0),
  newClickWords: Big(0),

  urgentJobNotification: null,

  caffeineX: 0,
  caffeineY: 0,
  caffeineAnimationInterval: 1,
  caffeineAnimationAmount: '1',
  caffeineAnimationNext: 0,
};

export default function () {
  return Object.assign({}, gameData);
}
