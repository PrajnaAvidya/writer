// generate jobs based on current stats

import Big from 'big.js';
import randomInt from '@/utils/randomInt';

export default function (wordValue, wps) {
  const jobs = {};

  // low
  let jobWordValue = wordValue.times(randomInt(15, 25) / 10);
  let words = wps.times(randomInt(60, 120));
  if (words.lt(200)) {
    words = Big(200);
  }
  jobs[1] = {
    id: 1,
    name: 'Small Job',
    words,
    payment: jobWordValue.times(words),
  };

  // medium
  jobWordValue = wordValue.times(randomInt(25, 35) / 10);
  words = wps.times(randomInt(240, 900));
  if (words.lt(1000)) {
    words = Big(1000);
  }
  jobs[2] = {
    id: 2,
    name: 'Medium Job',
    words,
    payment: jobWordValue.times(words),
  };

  // high
  jobWordValue = wordValue.times(randomInt(35, 45) / 10);
  words = wps.times(randomInt(1200, 3000));
  if (words.lt(2000)) {
    words = Big(2000);
  }
  jobs[3] = {
    id: 3,
    name: 'Large Job',
    words,
    payment: jobWordValue.times(words),
  };

  return jobs;
}
