// calculate words per second of workers

import Big from 'big.js';

export default function (workers) {
  console.log('Calculating WPS');
  let words = Big(0);
  Object.keys(workers).forEach((workerId) => {
    const worker = workers[workerId];

    const wordContribution = worker.quantity.times(worker.productivityMultiplier.times(worker.baseProductivity));

    if (wordContribution.gt(0)) {
      words = words.plus(wordContribution).times(worker.efficiencyMultiplier.times(worker.baseEfficiency));
    }
  });
  return words;
}
