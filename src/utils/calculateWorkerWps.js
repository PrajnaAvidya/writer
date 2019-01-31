// calculate words per second of workers

import Big from 'big.js';

export default function (workers) {
  let total = Big(0);
  const worker = {};
  Object.keys(workers).forEach((workerId) => {
    const wordContribution = workers[workerId].productivityMultiplier.times(workers[workerId].baseProductivity).times(workers[workerId].quantity);

    if (wordContribution.gt(0)) {
      total = total.plus(wordContribution);
    }
    worker[workerId] = wordContribution;
  });

  return {
    total,
    worker,
  };
}
