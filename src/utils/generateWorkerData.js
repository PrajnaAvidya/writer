// generate worker objects from data file

import workerData from '../data/workers';

export default function () {
  const workers = {};

  workerData.forEach((worker) => {
    workers[worker.id] = {
      id: worker.id,
      name: worker.name,
      plural: worker.plural,
      count: 0,
      cost: worker.baseCost,
      baseCost: worker.baseCost,
      costMultiplier: worker.costMultiplier,
      productivity: worker.productivity,
      quality: worker.quality,
    };
  });

  return workers;
}
