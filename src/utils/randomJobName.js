import randomInt from '@/utils/randomInt';
import jobNames from '@/data/words/jobNames';

export default function () {
  return jobNames[randomInt(0, jobNames.length - 1)];
}
