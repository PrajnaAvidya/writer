// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '../data/upgrades';
import workers from '../data/workers';

export default function () {
  const upgrades = {};
  let id = 0;

  // caffeine
  upgradeData.caffeine.forEach((caffeineUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'caffeine',
      name: 'Caffeine Upgrade',
      cost: Big(caffeineUpgrade.cost),
    };

    if (caffeineUpgrade.caffeineMaxLengthAdder) {
      upgrade.caffeineMaxLengthAdder = caffeineUpgrade.caffeineMaxLengthAdder;
    }
    if (caffeineUpgrade.caffeineLengthMultiplier) {
      upgrade.caffeineLengthMultiplier = caffeineUpgrade.caffeineLengthMultiplier;
    }
    if (caffeineUpgrade.caffeinePowerMultiplier) {
      upgrade.caffeinePowerMultiplier = caffeineUpgrade.caffeinePowerMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // clicking
  upgradeData.clicking.forEach((clickingUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'clicking',
      name: 'Clicking Upgrade',
      cost: Big(clickingUpgrade.cost),
    };

    if (clickingUpgrade.ideaMultiplier) {
      upgrade.clickingIdeaMultiplier = clickingUpgrade.ideaMultiplier;
    }
    if (clickingUpgrade.writingMultiplier) {
      upgrade.clickingWritingMultiplier = clickingUpgrade.writingMultiplier;
    }
    if (clickingUpgrade.maxWritingMultiplier) {
      upgrade.clickingMaxWritingMultiplier = clickingUpgrade.maxWritingMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // generic worker
  upgradeData.genericWorker.forEach((genericUpgrade) => {
    workers.forEach((worker) => {
      id += 1;
      const upgrade = {
        id,
        type: 'worker',
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
