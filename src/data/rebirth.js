import Big from 'big.js';
import workerIndex from '@/data/workers/workerIndex';
import bonuses from '@/data/bonuses';

export default {
  baseMilestonesNeeded: Big(20),
  rebirths: Big(0),
  plotPoints: Big(0),
  bonuses: {
    jobSlots: 1,
    hurryAmount: 1,
    workerCaffeine: workerIndex(false),
  },
  lockedBonuses: bonuses(),
};
