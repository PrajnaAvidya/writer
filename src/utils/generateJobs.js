// generate jobs based on current stats

import Big from 'big.js';
import randomInt from '@/utils/randomInt';

export default function (wordValue, wps) {
  const jobs = {};

  // tiny
  jobs[0] = {
    id: 0,
    completed: false,
    name: 'Tiny Job',
    words: Big(100),
    payment: Big(20),
  };

  // small
  let rewardRange = [125, 200]; // % of word value
  let wordRange = [30, 90]; // * current wps
  let jobWordValue = wordValue.times(randomInt(rewardRange[0], rewardRange[1]) / 100);
  let words = wps.times(randomInt(wordRange[0], wordRange[1]));
  if (words.lt(200)) {
    words = Big(200);
  }
  jobs[1] = {
    id: 1,
    completed: false,
    name: 'Small Job',
    words,
    payment: jobWordValue.times(words),
  };

  // medium
  rewardRange = [225, 300];
  wordRange = [180, 600];
  jobWordValue = wordValue.times(randomInt(rewardRange[0], rewardRange[1]) / 100);
  words = wps.times(randomInt(wordRange[0], wordRange[1]));
  if (words.lt(1000)) {
    words = Big(1000);
  }
  jobs[2] = {
    id: 2,
    completed: false,
    name: 'Medium Job',
    words,
    payment: jobWordValue.times(words),
  };

  // large
  rewardRange = [325, 400];
  wordRange = [900, 2400];
  jobWordValue = wordValue.times(randomInt(rewardRange[0], rewardRange[1]) / 100);
  words = wps.times(randomInt(wordRange[0], wordRange[1]));
  if (words.lt(2000)) {
    words = Big(2000);
  }
  jobs[3] = {
    id: 3,
    completed: false,
    name: 'Large Job',
    words,
    payment: jobWordValue.times(words),
  };

  return jobs;
}
