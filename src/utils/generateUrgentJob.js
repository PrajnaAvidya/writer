import randomInt from '@/utils/randomInt';
import randomJobName from '@/utils/randomJobName';

const rewardRangePercent = [750, 1500];
const wordsRangePercent = [10, 50];
const wpsRange = [180, 900];

export default function (currency, wps) {
  const jobWordValue = currency.wordValue.times(randomInt(rewardRangePercent[0], rewardRangePercent[1]) / 100);
  let words = currency.words.times(randomInt(wordsRangePercent[0], wordsRangePercent[1]) / 100).plus(wps.times(randomInt(wpsRange[0], wpsRange[1])));

  // set to attainable max
  const maximumWords = currency.words.plus(wps.times(55));
  if (words.gt(maximumWords)) {
    words = maximumWords;
  }

  return {
    id: 0,
    completed: false,
    name: `Urgent ${randomJobName()}`,
    words,
    payment: jobWordValue.times(words),
  };
}
