import bonuses from '@/data/bonuses';

export default {
  baseMilestonesNeeded: 30,
  rebirths: 0,
  plotPoints: 0,
  spentPlotPoints: 0,
  bonuses: {
    jobSlots: 1,
    jobWordMultiplier: 1.0,
    hurryAmount: 1,
    caffeineWordMultiplier: 1,
    passiveMoney: false,
    passiveMoneyAmount: 0.01,
    startingMoney: 0,
    autoCaffeine: false,
    buyAllUpgrades: false,
  },
  lockedBonuses: bonuses(),
  purchasedBonuses: [],
};
