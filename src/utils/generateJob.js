import Big from 'big.js';
import randomInt from '@/utils/randomInt';
import randomJobName from '@/utils/randomJobName';

const jobTypes = {
  1: {
    name: 'Tiny',
    rewardRange: [400, 500],
    wordRange: [10, 30],
    minimumWords: 100,
  },
  2: {
    name: 'Short',
    rewardRange: [500, 600],
    wordRange: [30, 90],
    minimumWords: 200,
  },
  3: {
    name: 'Medium',
    rewardRange: [600, 800],
    wordRange: [180, 600],
    minimumWords: 1000,
  },
  4: {
    name: 'Long',
    rewardRange: [800, 1000],
    wordRange: [900, 2400],
    minimumWords: 2000,
  },
  5: {
    name: 'Epic',
    rewardRange: [1000, 1200],
    wordRange: [3600, 9000],
    minimumWords: 10000,
  },
};

export default function (wordValue, wps, id) {
  const jobWordValue = wordValue.times(randomInt(jobTypes[id].rewardRange[0], jobTypes[id].rewardRange[1]) / 100);
  let words = wps.times(randomInt(jobTypes[id].wordRange[0], jobTypes[id].wordRange[1]));
  if (words.lt(jobTypes[id].minimumWords)) {
    words = Big(jobTypes[id].minimumWords);
  }

  return {
    id,
    completed: false,
    name: `${jobTypes[id].name} ${randomJobName()}`,
    words,
    payment: jobWordValue.times(words),
    currentPayment: jobWordValue.times(words).div(2),
  };
}
