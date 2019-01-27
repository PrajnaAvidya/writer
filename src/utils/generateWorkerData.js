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
      quantity: 0,
      cost: worker.baseCost,
      baseCost: worker.baseCost,
      costMultiplier: worker.costMultiplier,
      baseProductivity: worker.productivity,
      productivityMultiplier: Big(1),
    };
    if (workers[previousId]) {
      workers[previousId].nextId = worker.id;
    }

    previousId = worker.id;
  });

  return workers;
}
