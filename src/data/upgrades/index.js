
import staticUpgrades from '@/data/upgrades/static';
import infiniteUpgrade from '@/data/upgrades/infinite';

export default function () {
  const data = {
    upgrades: {},
    upgradeId: 0,
    revealedUpgrades: {},
    purchasedUpgrades: [],
  };

  // start with static upgrades
  data.upgrades = staticUpgrades();
  let upgradeId = Object.keys(data.upgrades)[Object.keys(data.upgrades).length - 1];

  // word value upgrades disabled because it doesn't make sense on its own currently
  // upgradeId += 1;
  // upgrades[upgradeId] = generateUpgrade(upgradeId, 'wordValue');

  // clicking upgrades
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'clicking');
  // caffeine power
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeinePower');
  // caffeine word gen
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeineGeneration');
  // job reward
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'jobReward');
  // urgent job reward
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'urgentJobReward');

  // set upgrade id
  data.upgradeId = Object.keys(data.upgrades)[Object.keys(data.upgrades).length - 1];

  return data;
}
