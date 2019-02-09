
import staticUpgrades from '@/data/upgrades/static';
import infiniteUpgrade from '@/data/upgrades/infinite';

export default function () {
  // start with static upgrades
  const upgrades = staticUpgrades();
  let upgradeId = Object.keys(upgrades)[Object.keys(upgrades).length - 1];

  // word value upgrades disabled because it doesn't make sense on its own currently
  // upgradeId += 1;
  // upgrades[upgradeId] = generateUpgrade(upgradeId, 'wordValue');

  // clicking upgrades
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'clicking');
  // caffeine power
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeinePower');
  // caffeine word gen
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeineGeneration');
  // job reward
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'jobReward');
  // urgent job reward
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'urgentJobReward');

  return upgrades;
}
