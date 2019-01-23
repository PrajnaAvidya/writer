// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '../data/upgrades';
import workers from '../data/workers';

export default function () {
  const upgrades = {};
  let id = 0;

  // TODO clicking
  /*
  upgrades.clicking = {};
  upgradeData.clicking.forEach((upgrade) => {
    upgrades.clicking[upgrade.id] = {
      id: upgrade.id,
    };
  });
  */

  // generic worker upgrades
  // TODO names/descriptions
  upgradeData.genericWorker.forEach((genericUpgrade) => {
    workers.forEach((worker) => {
      id += 1;
      const upgrade = {
        id,
        name: `${worker.name} Upgrade`,
        cost: Big(Big(genericUpgrade.cost).times(worker.baseCost)),
        requirements: {},
        productivityMultipliers: {},
        efficiencyMultipliers: {},
      };
      upgrade.requirements[worker.id] = Big(genericUpgrade.requirement);
      if (genericUpgrade.productivityMultiplier) {
        upgrade.productivityMultipliers[worker.id] = genericUpgrade.productivityMultiplier;
      }
      if (genericUpgrade.efficiencyMultiplier) {
        upgrade.efficiencyMultipliers[worker.id] = genericUpgrade.efficiencyMultiplier;
      }

      upgrades[id] = upgrade;
    });
  });

  // workers
  /*
  upgrades.workers = {};
  Object.keys(upgradeData.workers).forEach((workerId) => {
    let upgradeId = 1;
    upgrades.workers[workerId] = {};
    upgradeData.workers[workerId].forEach((upgrade) => {
      upgrades.workers[workerId][upgradeId] = upgrade;
      upgrades.workers[workerId][upgradeId].id = upgradeId;

      upgradeId += 1;
    });
  });
  */

  return upgrades;
}
