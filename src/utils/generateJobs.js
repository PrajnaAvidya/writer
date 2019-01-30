// generate jobs

import Big from 'big.js';
import randomInt from '@/utils/randomInt';

// rewardRange is % of word value (reward is that times job words)
// wordrange is * current words per second
function generateJob(id, name, wordValue, wps, rewardRange, wordRange, minimumWords) {
  const jobWordValue = wordValue.times(randomInt(rewardRange[0], rewardRange[1]) / 100);
  let words = wps.times(randomInt(wordRange[0], wordRange[1]));
  if (words.lt(minimumWords)) {
    words = Big(minimumWords);
  }

  return {
    id,
    completed: false,
    name,
    words,
    payment: jobWordValue.times(words),
  };
}

const jobData = {
  1: {
    name: 'Tiny Job',
    rewardRange: [200, 200],
    wordRange: [10, 30],
    minimumWords: 100,
  },
  2: {
    name: 'Small Job',
    rewardRange: [150, 200],
    wordRange: [30, 90],
    minimumWords: 200,
  },
  3: {
    name: 'Medium Job',
    rewardRange: [225, 300],
    wordRange: [180, 600],
    minimumWords: 1000,
  },
  4: {
    name: 'Large Job',
    rewardRange: [325, 400],
    wordRange: [900, 2400],
    minimumWords: 2000,
  },
  5: {
    name: 'Urgent Job',
    rewardRange: [750, 1000],
    wordRange: [180, 900],
    minimumWords: 1000,
  },
};

export default function (wordValue, wps, jobId = null) {
  if (jobId) {
    return generateJob(jobId, jobData[jobId].name, wordValue, wps, jobData[jobId].rewardRange, jobData[jobId].wordRange, jobData[jobId].minimumWords);
  }

  const jobs = {};
  for (let id = 1; id <= 4; id += 1) {
    jobs[id] = generateJob(id, jobData[id].name, wordValue, wps, jobData[id].rewardRange, jobData[id].wordRange, jobData[id].minimumWords);
  }

  return jobs;
}
