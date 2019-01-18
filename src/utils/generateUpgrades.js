// generate upgrade objects from data file

import upgradeData from '../data/upgrades';

export default function () {
  const upgrades = {};

  // TODO clicking
  /*
  upgrades.clicking = {};
  upgradeData.clicking.forEach((upgrade) => {
    upgrades.clicking[upgrade.id] = {
      id: upgrade.id,
    };
  });
  */

  // workers
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

  return upgrades;
}
