
import staticUpgrades from '@/data/upgrades/static';
import infiniteUpgrade from '@/data/upgrades/infinite';
import upgradeData from '@/data/upgrades/data';


export default function (adjectives) {
  // start with static upgrades
  const upgrades = staticUpgrades(adjectives);
  let upgradeId = Object.keys(upgrades)[Object.keys(upgrades).length - 1];

  // word value upgrades disabled because it doesn't make sense on its own currently
  // upgradeId += 1;
  // upgrades[upgradeId] = generateUpgrade(upgradeId, 'wordValue', adjectives);

  // clicking upgrades
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'clicking', adjectives);
  // caffeine power
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeinePower', adjectives);
  // caffeine word gen
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'caffeineGeneration', adjectives);
  // job reward
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'jobReward', adjectives);
  // urgent job reward
  upgradeId += 1;
  upgrades[upgradeId] = infiniteUpgrade(upgradeId, 'urgentJobReward', adjectives);

  return upgrades;
}
