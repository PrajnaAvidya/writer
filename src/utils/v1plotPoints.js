import localforage from 'localforage';

const bonusCosts = {
  1: 25,
  2: 100,
  3: 300,
  4: 1000,
  5: 100,
  6: 1000,
  7: 100,
  8: 500,
  9: 1000,
  10: 2500,
  11: 5000,
  12: 200,
  13: 1000,
  14: 2000,
  15: 5000,
  16: 10000,
  17: 1000,
  18: 2000,
  19: 3000,
  20: 4000,
  21: 5000,
  22: 6000,
  23: 7000,
  24: 8000,
  25: 9000,
  26: 10000,
};

export default async function () {
  const stateData = JSON.parse(await localforage.getItem('writerSaveState_rebirth'));
  let { plotPoints } = stateData;
  stateData.purchasedBonuses.forEach((bonusId) => {
    plotPoints += parseInt(bonusCosts[bonusId], 10);
  });

  return plotPoints;
}
