import Big from 'big.js';
import workerIndex from '@/data/workers/workerIndex';
import bonuses from '@/data/bonuses';

export default {
  baseMilestonesNeeded: Big(30),
  rebirths: Big(0),
  plotPoints: Big(0),
  spentPlotPoints: Big(0),
  bonuses: {
    jobSlots: 1,
    jobWordMultiplier: Big(1),
    hurryAmount: 1,
    caffeineWordMultiplier: Big(1),
    passiveMoney: false,
    passiveMoneyAmount: Big(0.01),
    startingMoney: Big(0),
  },
  lockedBonuses: bonuses(),
  purchasedBonuses: [],
};
