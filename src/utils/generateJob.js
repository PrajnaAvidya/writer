import Big from 'big.js';
import randomInt from '@/utils/randomInt';
import jobData from '@/data/jobs';

const jobTypes = {
  1: {
    name: 'Tiny',
    rewardRange: [200, 200],
    wordRange: [10, 30],
    minimumWords: 100,
  },
  2: {
    name: 'Short',
    rewardRange: [200, 250],
    wordRange: [30, 90],
    minimumWords: 200,
  },
  3: {
    name: 'Medium',
    rewardRange: [225, 300],
    wordRange: [180, 600],
    minimumWords: 1000,
  },
  4: {
    name: 'Long',
    rewardRange: [325, 400],
    wordRange: [900, 2400],
    minimumWords: 2000,
  },
  5: {
    name: 'Epic',
    rewardRange: [425, 500],
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
    name: `${jobTypes[id].name} ${jobData.names[randomInt(0, jobData.names.length - 1)]}`,
    words,
    payment: jobWordValue.times(words),
  };
}
