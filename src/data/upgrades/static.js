// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades/data';
import workers from '@/data/workers';

export default function (adjectives) {
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
        name: `${adjectives.pop()} ${worker.plural}`,
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
      name: `${adjectives.pop()} Caffeine`,
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

  // jobs
  let previousJobCooldownUpgrade = null;
  upgradeData.jobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'jobs',
      name: `${adjectives.pop()} Jobs`,
      cost: Big(jobUpgrade.cost),
      icon: 'fa-briefcase',
    };
    // set effect
    if (jobUpgrade.cooldownReduction) {
      upgrade.cooldownReduction = jobUpgrade.cooldownReduction;
      if (previousJobCooldownUpgrade) {
        upgrade.previousId = previousJobCooldownUpgrade;
      }
      previousJobCooldownUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  // urgent jobs
  let previousUrgentJobCooldownUpgrade = null;
  let previousUrgentJobTimerUpgrade = null;
  upgradeData.urgentJobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'urgentJobs',
      name: `${adjectives.pop()} Urgent Jobs`,
      cost: Big(jobUpgrade.cost),
      icon: 'fa-bullhorn',
    };
    // set effect
    if (jobUpgrade.cooldownMultiplier) {
      upgrade.cooldownMultiplier = jobUpgrade.cooldownMultiplier;
      if (previousUrgentJobCooldownUpgrade) {
        upgrade.previousId = previousUrgentJobCooldownUpgrade;
      }
      previousUrgentJobCooldownUpgrade = id;
    } else if (jobUpgrade.timerMultiplier) {
      upgrade.timerMultiplier = jobUpgrade.timerMultiplier;
      if (previousUrgentJobTimerUpgrade) {
        upgrade.previousId = previousUrgentJobTimerUpgrade;
      }
      previousUrgentJobTimerUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  return upgrades;
}
