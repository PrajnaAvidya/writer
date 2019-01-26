// generate worker objects from data file

import Big from 'big.js';
import workerData from '@/data/workers';

export default function () {
  const workers = {};
  let previousId = null;

  workerData.forEach((worker) => {
    workers[worker.id] = {
      id: worker.id,
      previousId,
      nextId: null,
      name: worker.name,
      pluralName: worker.plural,
      quantity: Big(0),
      cost: worker.baseCost,
      baseCost: worker.baseCost,
      costMultiplier: worker.costMultiplier,
      baseProductivity: worker.productivity,
      productivityMultiplier: Big(1),
      baseEfficiency: worker.efficiency,
      efficiencyMultiplier: Big(1),
      balance: 0, // 0 is 100% ideas, 10 is 100% words
    };
    if (previousId !== null) {
      workers[previousId].nextId = worker.id;
    }

    previousId = worker.id;
  });

  return workers;
}
