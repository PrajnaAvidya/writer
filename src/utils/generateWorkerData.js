// generate worker objects from data file

import Big from 'big.js';
import workerData from '@/data/workers';
import workerCost from '@/utils/workerCost';

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
      costs: {
        0: workerCost(worker.baseCost, 0, worker.costMultiplier, 1),
        1: workerCost(worker.baseCost, 0, worker.costMultiplier, 10),
        2: workerCost(worker.baseCost, 0, worker.costMultiplier, 100),
      },
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
