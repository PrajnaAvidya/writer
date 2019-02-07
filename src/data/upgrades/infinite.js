// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades/data';

export default function (id, type, adjectives, previousUpgrade = null) {
  const upgrade = {
    id,
    type,
    infinite: true,
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
  } else if (type === 'caffeinePower') {
    upgrade.name = `${adjectives.pop()} Caffeine Power`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.caffeinePower.scale) : Big(upgradeData.caffeinePower.base);
    upgrade.multiplier = upgradeData.caffeinePower.multiplier;
    upgrade.icon = 'fa-coffee';
  } else if (type === 'caffeineGeneration') {
    upgrade.name = `${adjectives.pop()} Caffeine Word Generation`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.caffeineGeneration.scale) : Big(upgradeData.caffeineGeneration.base);
    upgrade.multiplier = upgradeData.caffeineGeneration.multiplier;
    upgrade.icon = 'fa-coffee';
  } else if (type === 'jobReward') {
    upgrade.name = `${adjectives.pop()} Job Rewards`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.jobReward.scale) : Big(upgradeData.jobReward.base);
    upgrade.multiplier = upgradeData.jobReward.multiplier;
    upgrade.icon = 'fa-briefcase';
  } else if (type === 'urgentJobReward') {
    upgrade.name = `${adjectives.pop()} Urgent Job Rewards`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.urgentJobReward.scale) : Big(upgradeData.urgentJobReward.base);
    upgrade.multiplier = upgradeData.urgentJobReward.multiplier;
    upgrade.icon = 'fa-bullhorn';
  }

  return upgrade;
}
