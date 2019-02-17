import bonusData from '@/data/bonuses/data';

export default function () {
  const bonuses = {};
  let id = 0;
  const previousIds = {};

  bonusData.forEach((bonus) => {
    id += 1;
    bonuses[id] = Object.assign({}, bonus);
    bonuses[id].id = id;
    if (previousIds[bonus.type]) {
      bonuses[id].previousId = previousIds[bonus.type];
    }
    previousIds[bonus.type] = id;
  });

  return bonuses;
}
