// generate jobs

import Big from 'big.js';
import randomInt from '@/utils/randomInt';
import jobData from '@/data/jobs';

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
    name: `${name} ${jobData.names[randomInt(0, jobData.names.length - 1)]}`,
    words,
    payment: jobWordValue.times(words),
  };
}

const jobTypes = {
  1: {
    name: 'Tiny',
    rewardRange: [200, 200],
    wordRange: [10, 30],
    minimumWords: 100,
  },
  2: {
    name: 'Short',
    rewardRange: [150, 200],
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
    name: 'Urgent',
    rewardRange: [750, 1000],
    wordRange: [180, 900],
    minimumWords: 1000,
  },
};

export default function (wordValue, wps, jobId = null) {
  if (jobId) {
    return generateJob(jobId, jobTypes[jobId].name, wordValue, wps, jobTypes[jobId].rewardRange, jobTypes[jobId].wordRange, jobTypes[jobId].minimumWords);
  }

  const jobs = {};
  for (let id = 1; id <= 4; id += 1) {
    jobs[id] = generateJob(id, jobTypes[id].name, wordValue, wps, jobTypes[id].rewardRange, jobTypes[id].wordRange, jobTypes[id].minimumWords);
  }

  return jobs;
}
