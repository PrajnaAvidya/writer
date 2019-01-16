// generate worker objects from data file

import Big from 'big.js';
import workerData from '../data/workers';

export default function () {
  const workers = {};

  workerData.forEach((worker) => {
    workers[worker.id] = {
      id: worker.id,
      name: worker.name,
      plural: worker.plural,
      count: Big(0),
      cost: worker.baseCost,
      baseCost: worker.baseCost,
      costMultiplier: worker.costMultiplier,
      productivity: worker.productivity,
      quality: worker.quality,
      balance: 0, // 0 is 100% ideas, 10 is 100% words
    };
  });

  return workers;
}
