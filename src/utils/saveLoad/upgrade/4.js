import Vue from 'vue';
import Big from 'big.js';
import store from '@/store';
import bonusGenerator from '@/data/bonuses';
import jobWordSkills from '@/data/saveLoad/4/jobWordSkills';
import autoCaffeineSkill from '@/data/saveLoad/4/autoCaffeineSkill';
import buyUpgradesSkill from '@/data/saveLoad/4/buyUpgradesSkill';
import managersSkill from '@/data/saveLoad/4/managersSkill';

export default function () {
  // remove/change vars
  delete store.state.currency.playerWords;
  store.state.caffeine.caffeineMinimumWordGeneration = 4;
  store.state.jobs.jobRewardMultiplier = parseInt(store.state.jobs.jobRewardMultiplier, 10);
  store.state.jobs.urgentJobRewardMultiplier = parseInt(store.state.jobs.urgentJobRewardMultiplier, 10);
  store.state.rebirth.baseMilestonesNeeded = parseInt(store.state.rebirth.baseMilestonesNeeded, 10);
  store.state.rebirth.rebirths = parseInt(store.state.rebirth.rebirths, 10);
  store.state.rebirth.plotPoints = parseInt(store.state.rebirth.plotPoints, 10);
  store.state.rebirth.spentPlotPoints = parseInt(store.state.rebirth.spentPlotPoints, 10);
  store.state.rebirth.bonuses.caffeineWordMultiplier = parseInt(store.state.rebirth.bonuses.caffeineWordMultiplier, 10);
  store.state.rebirth.bonuses.passiveMoneyAmount = parseFloat(store.state.rebirth.bonuses.passiveMoneyAmount);
  store.state.rebirth.bonuses.startingMoney = parseInt(store.state.rebirth.bonuses.startingMoney, 10);

  // add lastBonusId
  store.state.rebirth.lastBonusId = Math.max(...store.state.rebirth.purchasedBonuses.concat(Object.keys(store.state.rebirth.lockedBonuses)));

  // job word multiplier
  store.state.rebirth.bonuses.jobWordMultiplier = 1.0;
  let newBonusSkills = bonusGenerator(jobWordSkills, store.state.rebirth.lastBonusId);
  Object.keys(newBonusSkills).forEach((bonusId) => {
    store.state.rebirth.lockedBonuses[bonusId] = newBonusSkills[bonusId];
    store.state.rebirth.lastBonusId = bonusId > store.state.rebirth.lastBonusId ? bonusId : store.state.rebirth.lastBonusId;
  });

  // auto caffeine
  store.state.rebirth.bonuses.autoCaffeine = false;
  newBonusSkills = bonusGenerator(autoCaffeineSkill, store.state.rebirth.lastBonusId);
  store.state.rebirth.lastBonusId += 1;
  store.state.rebirth.lockedBonuses[store.state.rebirth.lastBonusId] = newBonusSkills[store.state.rebirth.lastBonusId];

  // buy all upgrades
  store.state.rebirth.bonuses.buyAllUpgrades = false;
  newBonusSkills = bonusGenerator(buyUpgradesSkill, store.state.rebirth.lastBonusId);
  store.state.rebirth.lastBonusId += 1;
  store.state.rebirth.lockedBonuses[store.state.rebirth.lastBonusId] = newBonusSkills[store.state.rebirth.lastBonusId];

  // managers
  store.state.statistics.stats.managers = 0;
  store.state.statistics.statDescriptions.managers = 'Managers Hired';
  store.state.statistics.milestoneTargets.managers = 3;
  store.state.statistics.milestoneCount.managers = 0;
  store.state.rebirth.bonuses.managerHiringTimer = 10;
  store.state.rebirth.bonuses.managerHiringAmount = 1;
  newBonusSkills = bonusGenerator(managersSkill, store.state.rebirth.lastBonusId);
  Object.keys(newBonusSkills).forEach((bonusId) => {
    store.state.rebirth.lockedBonuses[bonusId] = newBonusSkills[bonusId];
    store.state.rebirth.lastBonusId = bonusId > store.state.rebirth.lastBonusId ? bonusId : store.state.rebirth.lastBonusId;
  });
  Object.keys(store.state.workers.workers).forEach((workerId) => {
    store.state.workers.workers[workerId].managerHired = 0;
  });

  Vue.$ga.event({
    eventCategory: 'Game',
    eventAction: 'Upgrade',
    eventLabel: '4',
  });
}
