
import staticUpgrades from '@/data/upgrades/static';
import infiniteUpgrade from '@/data/upgrades/infinite';

export default function () {
  const data = {
    upgrades: {},
    upgradeId: 0,
    purchasedUpgrades: [],
  };

  // start with static upgrades
  data.upgrades = staticUpgrades();
  let upgradeId = parseInt(Object.keys(data.upgrades)[Object.keys(data.upgrades).length - 1], 10);

  // clicking upgrades
  upgradeId += 1;
  data.upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'clicking');
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
