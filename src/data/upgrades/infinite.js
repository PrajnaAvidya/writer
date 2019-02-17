// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades/data';
import randomAdjective from '@/utils/randomAdjective';

export default function (id, type, previousUpgrade = null) {
  const upgrade = {
    id,
    type,
    infinite: true,
  };

  if (type === 'clicking') {
    upgrade.name = `${randomAdjective()} Clicking`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.clicking.scale) : Big(upgradeData.clicking.base);
    upgrade.writingMultiplier = upgradeData.clicking.multiplier;
    upgrade.icon = 'fa-mouse-pointer';
  } else if (type === 'wordValue') {
    upgrade.name = `${randomAdjective()} Word Value`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.wordValue.scale) : Big(upgradeData.wordValue.base);
    upgrade.multiplier = upgradeData.wordValue.multiplier;
    upgrade.icon = 'fa-dollar-sign';
  } else if (type === 'caffeineGeneration') {
    upgrade.name = `${randomAdjective()} Caffeine Word Generation`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.caffeineGeneration.scale) : Big(upgradeData.caffeineGeneration.base);
    upgrade.multiplier = upgradeData.caffeineGeneration.multiplier;
    upgrade.icon = 'fa-coffee';
  } else if (type === 'jobReward') {
    upgrade.name = `${randomAdjective()} Job Rewards`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.jobReward.scale) : Big(upgradeData.jobReward.base);
    upgrade.multiplier = upgradeData.jobReward.multiplier;
    upgrade.icon = 'fa-briefcase';
  } else if (type === 'urgentJobReward') {
    upgrade.name = `${randomAdjective()} Urgent Job Rewards`;
    upgrade.cost = previousUpgrade ? previousUpgrade.cost.times(upgradeData.urgentJobReward.scale) : Big(upgradeData.urgentJobReward.base);
    upgrade.multiplier = upgradeData.urgentJobReward.multiplier;
    upgrade.icon = 'fa-bullhorn';
  }

  return upgrade;
}
