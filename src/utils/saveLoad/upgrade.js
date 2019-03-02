import Vue from 'vue';
import Big from 'big.js';
import store from '@/store';
import bonusGenerator from '@/data/bonuses';
import log from '@/utils/log';
import version from '@/data/saveLoad/version';
import jobWordSkills from '@/data/saveLoad/4/jobWordSkills';
import autoCaffeineSkill from '@/data/saveLoad/4/autoCaffeineSkill';

export default function (saveData) {
  let upgraded = false;
  if (saveData.version < version) {
    log(`upgrading save from version ${saveData.version}`);

    if (saveData.version === 3) {
      // change Bigs to ints
      store.state.caffeine.caffeineMinimumWordGeneration = 4;

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

      saveData.version = 4;
      Vue.$ga.event({
        eventCategory: 'Game',
        eventAction: 'Upgrade',
        eventLabel: '4',
      });
    }

    upgraded = true;
  }

  return upgraded;
}
