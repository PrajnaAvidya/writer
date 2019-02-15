// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades/data';
import workers from '@/data/workers/data';
import randomAdjective from '@/utils/randomAdjective';

export default function () {
  const upgrades = {};
  let id = 0;

  // workers
  workers.forEach((worker) => {
    let previousWorkerUpgrade = null;
    upgradeData.genericWorker.forEach((genericUpgrade) => {
      id += 1;

      const upgrade = {
        id,
        type: 'worker',
        name: `${randomAdjective()} ${worker.plural}`,
        cost: Big(Big(genericUpgrade.cost).times(worker.baseCost)),
        requirements: {},
        multipliers: {},
        icon: worker.icon,
      };
      upgrade.requirements[worker.id] = genericUpgrade.requirement;
      if (genericUpgrade.multiplier) {
        upgrade.multipliers[worker.id] = genericUpgrade.multiplier;
      }

      // set previous id
      if (previousWorkerUpgrade) {
        upgrade.previousId = previousWorkerUpgrade;
      }
      previousWorkerUpgrade = id;

      upgrades[id] = upgrade;
    });
  });

  // caffeine
  let previousCaffeineCooldownUpgrade = null;
  let previousCaffeineLengthUpgrade = null;
  upgradeData.caffeine.forEach((caffeineUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'caffeine',
      name: `${randomAdjective()} Caffeine`,
      cost: Big(caffeineUpgrade.cost),
      icon: 'fa-coffee',
    };

    // set effect
    if (caffeineUpgrade.cooldownReduction) {
      upgrade.cooldownReduction = caffeineUpgrade.cooldownReduction;
      if (previousCaffeineCooldownUpgrade) {
        upgrade.previousId = previousCaffeineCooldownUpgrade;
      }
      previousCaffeineCooldownUpgrade = id;
    } else if (caffeineUpgrade.lengthMultiplier) {
      upgrade.lengthMultiplier = caffeineUpgrade.lengthMultiplier;
      if (previousCaffeineLengthUpgrade) {
        upgrade.previousId = previousCaffeineLengthUpgrade;
      }
      previousCaffeineLengthUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  // job cooldown
  let previousJobCooldownUpgrade = null;
  upgradeData.jobCooldown.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'jobCooldown',
      name: `${randomAdjective()} Jobs`,
      cooldownReduction: jobUpgrade.cooldownReduction,
      cost: Big(jobUpgrade.cost),
      icon: 'fa-briefcase',
    };
    upgrade.cooldownReduction = jobUpgrade.cooldownReduction;
    if (previousJobCooldownUpgrade) {
      upgrade.previousId = previousJobCooldownUpgrade;
    }
    previousJobCooldownUpgrade = id;

    upgrades[id] = upgrade;
  });

  // urgent job cooldown
  let previousUrgentJobCooldownUpgrade = null;
  upgradeData.urgentJobCooldown.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'urgentJobCooldown',
      name: `${randomAdjective()} Urgent Jobs`,
      cooldownMultiplier: jobUpgrade.cooldownMultiplier,
      cost: Big(jobUpgrade.cost),
      icon: 'fa-bullhorn',
    };
    if (previousUrgentJobCooldownUpgrade) {
      upgrade.previousId = previousUrgentJobCooldownUpgrade;
    }
    previousUrgentJobCooldownUpgrade = id;

    upgrades[id] = upgrade;
  });

  return upgrades;
}
