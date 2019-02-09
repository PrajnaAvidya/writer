import randomInt from '@/utils/randomInt';
import adjectives from '@/data/words/adjectives';

export default function () {
  return adjectives[randomInt(0, adjectives.length - 1)];
}
