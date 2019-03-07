// generate worker objects from data file

import Big from 'big.js';
import workerData from '@/data/workers/data';
import workerCost from '@/utils/workerCost';
import workerIndex from '@/data/workers/workerIndex';

export default function () {
  const workers = {
    // workers
    workers: {},
    buyAmount: 1,
    buyAmountIndex: 0,
    workerQuantities: workerIndex(0),
    workerWps: Big(0),
    individualWorkerWps: {},
    workerTooltips: {},
  };
  let previousId = null;

  workerData.forEach((worker) => {
    workers.workers[worker.id] = {
      id: worker.id,
      previousId,
      name: worker.name,
      pluralName: worker.plural,
      quantity: 0,
      managerHired: 0,
      costs: {
        0: workerCost(worker.baseCost, 0, worker.costMultiplier, 1),
        1: workerCost(worker.baseCost, 0, worker.costMultiplier, 10),
        2: workerCost(worker.baseCost, 0, worker.costMultiplier, 100),
      },
      baseCost: worker.baseCost,
      costMultiplier: worker.costMultiplier,
      baseProductivity: worker.productivity,
      productivityMultiplier: Big(1),
      icon: worker.icon,
    };

    previousId = worker.id;
  });

  return workers;
}
