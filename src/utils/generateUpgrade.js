// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades';

export default function (id, type, adjectives, previousUpgrade = null) {
  const upgrade = {
    id,
    type,
  };

  if (type === 'clicking') {
    upgrade.name = `${adjectives.pop()} Clicking`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.clicking.scale) : Big(upgradeData.clicking.base);
    upgrade.writingMultiplier = upgradeData.clicking.multiplier;
    upgrade.icon = 'fa-mouse-pointer';
  } else if (type === 'wordValue') {
    upgrade.name = `${adjectives.pop()} Word Value`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.wordValue.scale) : Big(upgradeData.wordValue.base);
    upgrade.multiplier = upgradeData.wordValue.multiplier;
    upgrade.icon = 'fa-dollar-sign';
  }

  return upgrade;
}
