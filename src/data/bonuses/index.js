import bonusData from '@/data/bonuses/data';

export default function () {
  const bonuses = {};
  let id = 0;

  bonusData.forEach((bonus) => {
    id += 1;
    bonuses[id] = Object.assign({}, bonus);
    bonuses[id].id = id;
  });

  return bonuses;
}
