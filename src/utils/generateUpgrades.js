// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades';
import workers from '@/data/workers';
import store from '@/store';

export default function () {
  const upgrades = {};
  let id = 0;

  // caffeine
  let previousCaffeineCooldownUpgrade = null;
  let previousCaffeineLengthUpgrade = null;
  let previousCaffeinePowerUpgrade = null;
  let previousCaffeineWordUpgrade = null;
  upgradeData.caffeine.forEach((caffeineUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'caffeine',
      name: `${store.state.adjectives.pop()} Caffeine`,
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
    } else if (caffeineUpgrade.powerMultiplier) {
      upgrade.powerMultiplier = caffeineUpgrade.powerMultiplier;
      if (previousCaffeinePowerUpgrade) {
        upgrade.previousId = previousCaffeinePowerUpgrade;
      }
      previousCaffeinePowerUpgrade = id;
    } else if (caffeineUpgrade.wordMultiplier) {
      upgrade.wordMultiplier = caffeineUpgrade.wordMultiplier;
      if (previousCaffeineWordUpgrade) {
        upgrade.previousId = previousCaffeineWordUpgrade;
      }
      previousCaffeineWordUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  // clicking
  let previousClickingUpgrade = null;
  upgradeData.clicking.forEach((clickingUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'clicking',
      name: `${store.state.adjectives.pop()} Clicking`,
      cost: Big(clickingUpgrade.cost),
      icon: 'fa-mouse-pointer',
    };
    if (clickingUpgrade.writingMultiplier) {
      upgrade.writingMultiplier = clickingUpgrade.writingMultiplier;
    }

    // set previous id
    if (previousClickingUpgrade) {
      upgrade.previousId = previousClickingUpgrade;
    }
    previousClickingUpgrade = id;

    upgrades[id] = upgrade;
  });

  // generic worker
  workers.forEach((worker) => {
    let previousWorkerUpgrade = null;
    upgradeData.genericWorker.forEach((genericUpgrade) => {
      id += 1;

      const upgrade = {
        id,
        type: 'worker',
        name: `${store.state.adjectives.pop()} ${worker.plural}`,
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

  // jobs
  let previousJobCooldownUpgrade = null;
  let previousJobRewardUpgrade = null;
  upgradeData.jobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'jobs',
      name: `${store.state.adjectives.pop()} Jobs`,
      cost: Big(jobUpgrade.cost),
      icon: 'fa-briefcase',
    };
    // set effect
    if (jobUpgrade.cooldownMultiplier) {
      upgrade.cooldownMultiplier = jobUpgrade.cooldownMultiplier;
      if (previousJobCooldownUpgrade) {
        upgrade.previousId = previousJobCooldownUpgrade;
      }
      previousJobCooldownUpgrade = id;
    } else if (jobUpgrade.rewardMultiplier) {
      upgrade.rewardMultiplier = jobUpgrade.rewardMultiplier;
      if (previousJobRewardUpgrade) {
        upgrade.previousId = previousJobRewardUpgrade;
      }
      previousJobRewardUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  // urgent jobs
  let previousUrgentJobCooldownUpgrade = null;
  let previousUrgentJobTimerUpgrade = null;
  let previousUrgentJobMultiplierUpgrade = null;
  upgradeData.urgentJobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'urgentJobs',
      name: `${store.state.adjectives.pop()} Urgent Jobs`,
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
    } else if (jobUpgrade.rewardMultiplier) {
      upgrade.rewardMultiplier = jobUpgrade.rewardMultiplier;
      if (previousUrgentJobMultiplierUpgrade) {
        upgrade.previousId = previousUrgentJobMultiplierUpgrade;
      }
      previousUrgentJobMultiplierUpgrade = id;
    }

    upgrades[id] = upgrade;
  });

  // word value
  let previousWordValueUpgrade = null;
  upgradeData.wordValue.forEach((wordValueUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'wordValue',
      name: `${store.state.adjectives.pop()} Word Value`,
      cost: Big(wordValueUpgrade.cost),
      multiplier: wordValueUpgrade.multiplier,
      icon: 'fa-dollar-sign',
    };

    // set previous id
    if (previousWordValueUpgrade) {
      upgrade.previousId = previousWordValueUpgrade;
    }
    previousWordValueUpgrade = id;

    upgrades[id] = upgrade;
  });

  return upgrades;
}
