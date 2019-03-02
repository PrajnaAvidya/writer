import defaultData from '@/data/bonuses/data';

export default function (customData = null, lastId = 0) {
  const bonuses = {};
  const previousIds = {};

  const bonusData = customData || defaultData;
  bonusData.forEach((bonus) => {
    lastId += 1;
    bonuses[lastId] = Object.assign({}, bonus);
    bonuses[lastId].id = lastId;
    if (previousIds[bonus.type]) {
      bonuses[lastId].previousId = previousIds[bonus.type];
    }
    previousIds[bonus.type] = lastId;
  });

  return bonuses;
}
