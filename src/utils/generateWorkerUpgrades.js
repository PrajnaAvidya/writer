// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades';
import workers from '@/data/workers';

export default function (adjectives) {
  const upgrades = {};
  let id = 0;
  workers.forEach((worker) => {
    let previousWorkerUpgrade = null;
    upgradeData.genericWorker.forEach((genericUpgrade) => {
      id += 1;

      const upgrade = {
        id,
        type: 'worker',
        name: `${adjectives.pop()} ${worker.plural}`,
        cost: Big(Big(genericUpgrade.cost).times(worker.baseCost)),
        requirements: {},
        multipliers: {},
        icon: worker.icon,
      };
      upgrade.requirements[worker.id] = genericUpgrade.requirement;
      if (genericUpgrade.multiplier) {
        upgrade.multipliers[worker.id] = genericUpgrade.multiplier;
      }

      // set previous id
      if (previousWorkerUpgrade) {
        upgrade.previousId = previousWorkerUpgrade;
      }
      previousWorkerUpgrade = id;

      upgrades[id] = upgrade;
    });
  });

  return upgrades;
}
