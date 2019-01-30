// generate upgrade objects from data file

import Big from 'big.js';
import upgradeData from '@/data/upgrades';
import workers from '@/data/workers';

export default function () {
  const upgrades = {};
  let id = 0;

  // caffeine
  upgradeData.caffeine.forEach((caffeineUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'caffeine',
      name: 'Caffeine Upgrade',
      cost: Big(caffeineUpgrade.cost),
    };

    if (caffeineUpgrade.cooldownReduction) {
      upgrade.cooldownReduction = caffeineUpgrade.cooldownReduction;
    }
    if (caffeineUpgrade.lengthMultiplier) {
      upgrade.lengthMultiplier = caffeineUpgrade.lengthMultiplier;
    }
    if (caffeineUpgrade.powerMultiplier) {
      upgrade.powerMultiplier = caffeineUpgrade.powerMultiplier;
    }
    if (caffeineUpgrade.wordMultiplier) {
      upgrade.wordMultiplier = caffeineUpgrade.wordMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // clicking
  upgradeData.clicking.forEach((clickingUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'clicking',
      name: 'Clicking Upgrade',
      cost: Big(clickingUpgrade.cost),
    };
    if (clickingUpgrade.writingMultiplier) {
      upgrade.writingMultiplier = clickingUpgrade.writingMultiplier;
    }
    if (clickingUpgrade.maxWritingMultiplier) {
      upgrade.maxWritingMultiplier = clickingUpgrade.maxWritingMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // generic worker
  upgradeData.genericWorker.forEach((genericUpgrade) => {
    workers.forEach((worker) => {
      id += 1;

      const upgrade = {
        id,
        type: 'worker',
        name: `${worker.name} Upgrade`,
        cost: Big(Big(genericUpgrade.cost).times(worker.baseCost)),
        requirements: {},
        multipliers: {},
      };
      upgrade.requirements[worker.id] = genericUpgrade.requirement;
      if (genericUpgrade.multiplier) {
        upgrade.multipliers[worker.id] = genericUpgrade.multiplier;
      }

      upgrades[id] = upgrade;
    });
  });

  // jobs
  upgradeData.jobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'jobs',
      name: 'Jobs Upgrade',
      cost: Big(jobUpgrade.cost),
    };
    if (jobUpgrade.cooldownMultiplier) {
      upgrade.cooldownMultiplier = jobUpgrade.cooldownMultiplier;
    }
    if (jobUpgrade.rewardMultiplier) {
      upgrade.rewardMultiplier = jobUpgrade.rewardMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // urgent jobs
  upgradeData.urgentJobs.forEach((jobUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'urgentJobs',
      name: 'Urgent Jobs Upgrade',
      cost: Big(jobUpgrade.cost),
    };
    if (jobUpgrade.cooldownMultiplier) {
      upgrade.cooldownMultiplier = jobUpgrade.cooldownMultiplier;
    }
    if (jobUpgrade.timerMultiplier) {
      upgrade.timerMultiplier = jobUpgrade.timerMultiplier;
    }
    if (jobUpgrade.rewardMultiplier) {
      upgrade.rewardMultiplier = jobUpgrade.rewardMultiplier;
    }

    upgrades[id] = upgrade;
  });

  // word value
  upgradeData.wordValue.forEach((wordValueUpgrade) => {
    id += 1;

    const upgrade = {
      id,
      type: 'wordValue',
      name: 'Word Value Upgrade',
      cost: Big(wordValueUpgrade.cost),
      multiplier: wordValueUpgrade.multiplier,
    };

    upgrades[id] = upgrade;
  });

  return upgrades;
}
