import Big from 'big.js';
import workerIndex from '@/data/workers/workerIndex';

export default function () {
  const data = {
    recruiters: workerIndex(0),
    recruiterCosts: workerIndex(Big(0)),
  };

  return data;
}
