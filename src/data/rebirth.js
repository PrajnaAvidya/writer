import Big from 'big.js';
import workerIndex from '@/data/workers/workerIndex';
import bonuses from '@/data/bonuses';

export default {
  baseMilestonesNeeded: Big(25),
  rebirths: Big(0),
  plotPoints: Big(0),
  bonuses: {
    jobSlots: 1,
    hurryAmount: 1,
    workerCaffeine: workerIndex(false),
    caffeineWordMultiplier: Big(1),
    caffeineClickWps: Big(0),
  },
  lockedBonuses: bonuses(),
};
