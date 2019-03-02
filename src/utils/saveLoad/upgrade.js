import Big from 'big.js';
import store from '@/store';
import bonusGenerator from '@/data/bonuses';
import log from '@/utils/log';
import version from '@/data/saveLoad/version';
import jobWordSkills from '@/data/saveLoad/4/jobWordSkills';

export default function (saveData) {
  let upgraded = false;
  if (saveData.version < version) {
    log(`upgrading save from version ${saveData.version}`);

    if (saveData.version === 3) {
      // add lastBonusId
      store.state.rebirth.lastBonusId = Math.max(...store.state.rebirth.purchasedBonuses.concat(Object.keys(store.state.rebirth.lockedBonuses)));

      // add job word bonus var
      store.state.rebirth.bonuses.jobWordMultiplier = Big(1);
      // add job word bonus skills
      const newBonusSkills = bonusGenerator(jobWordSkills, store.state.rebirth.lastBonusId);
      Object.keys(newBonusSkills).forEach((bonusId) => {
        store.state.rebirth.lockedBonuses[bonusId] = newBonusSkills[bonusId];
        store.state.rebirth.lastBonusId = bonusId > store.state.rebirth.lastBonusId ? bonusId : store.state.rebirth.lastBonusId;
      });

      saveData.version = 4;
    }

    upgraded = true;
  }

  return upgraded;
}
