import Big from 'big.js';
import workerIndex from '@/data/workers/workerIndex';

export default function () {
  const data = {
    managers: workerIndex(0),
    managerCosts: workerIndex(Big(0)),
  };

  return data;
}
