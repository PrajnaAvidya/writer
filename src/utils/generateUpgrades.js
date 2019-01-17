// generate upgrade objects from data file

import Big from 'big.js';
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

  // TODO workers
  upgrades.workers = {};
  Object.keys(upgradeData.workers).forEach((workerId) => {
    const upgrade = upgradeData.workers[workerId];

    upgrades.workers[workerId] = {
      //
    };
  });

  console.log(upgrades);
  return upgrades;
}
