import Vue from 'vue';
import Big from 'big.js';
import store from '@/store';
import bonusGenerator from '@/data/bonuses';
import jobWordSkills from '@/data/saveLoad/4/jobWordSkills';
import autoCaffeineSkill from '@/data/saveLoad/4/autoCaffeineSkill';

export default function () {
  // remove/change vars
  delete store.state.currency.playerWords;
  store.state.caffeine.caffeineMinimumWordGeneration = 4;
  store.state.jobs.jobRewardMultiplier = parseInt(store.state.jobs.jobRewardMultiplier, 10);
  store.state.jobs.urgentJobRewardMultiplier = parseInt(store.state.jobs.urgentJobRewardMultiplier, 10);

  // add lastBonusId
  store.state.rebirth.lastBonusId = Math.max(...store.state.rebirth.purchasedBonuses.concat(Object.keys(store.state.rebirth.lockedBonuses)));

  // add job word bonus var/skills
  store.state.rebirth.bonuses.jobWordMultiplier = Big(1);
  let newBonusSkills = bonusGenerator(jobWordSkills, store.state.rebirth.lastBonusId);
  Object.keys(newBonusSkills).forEach((bonusId) => {
    store.state.rebirth.lockedBonuses[bonusId] = newBonusSkills[bonusId];
    store.state.rebirth.lastBonusId = bonusId > store.state.rebirth.lastBonusId ? bonusId : store.state.rebirth.lastBonusId;
  });

  // add caffeine bonus var/skill
  store.state.rebirth.bonuses.autoCaffeine = false;
  newBonusSkills = bonusGenerator(autoCaffeineSkill, store.state.rebirth.lastBonusId);
  store.state.rebirth.lastBonusId += 1;
  store.state.rebirth.lockedBonuses[store.state.rebirth.lastBonusId] = newBonusSkills[store.state.rebirth.lastBonusId];

  Vue.$ga.event({
    eventCategory: 'Game',
    eventAction: 'Upgrade',
    eventLabel: '4',
  });
}
