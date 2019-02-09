// calculate words per second of workers

import Big from 'big.js';

export default function (workers, caffeine, workerCaffeine, multiplier) {
  let total = Big(0);
  const worker = {};
  const tooltips = {};
  Object.keys(workers).forEach((workerId) => {
    const baseContrubution = workers[workerId].productivityMultiplier.times(workers[workerId].baseProductivity);
    let totalContribution = baseContrubution.times(workers[workerId].quantity);

    // caffeine
    if (caffeine === true && workerCaffeine[workerId] === true) {
      totalContribution = totalContribution.times(multiplier);
    }

    if (totalContribution.gt(0)) {
      total = total.plus(totalContribution);
    }
    worker[workerId] = totalContribution;

    // set tooltip
    if (baseContrubution.eq(0)) {
      tooltips[workerId] = 'Produces no words (useless!)';
    } else if (baseContrubution.eq(1)) {
      tooltips[workerId] = 'Produces 1 word per second';
    } else {
      tooltips[workerId] = `Produces ${baseContrubution} words per second`;
    }
  });

  return {
    total,
    worker,
    tooltips,
  };
}
