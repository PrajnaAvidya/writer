import Big from 'big.js';

export default {
  words: Big(10000),
  money: Big(10000),
  wordValue: Big(0.10),
  playerWords: Big(1), // clicking amount
  milestones: Big(0),
  totalWps: Big(0), // worker + caffeine wps
};
