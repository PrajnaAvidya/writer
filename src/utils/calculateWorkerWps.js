// calculate words per second of workers

import Big from 'big.js';

export default function (workers) {
  let words = Big(0);
  Object.keys(workers).forEach((workerId) => {
    const worker = workers[workerId];

    const wordContribution = worker.productivityMultiplier.times(worker.baseProductivity).times(worker.quantity);

    if (wordContribution.gt(0)) {
      words = words.plus(wordContribution);
    }
  });
  return words;
}
