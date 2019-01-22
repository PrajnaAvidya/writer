// generate worker objects from data file

import Big from 'big.js';
import workerData from '../data/workers';

export default function () {
  const workers = {};

  workerData.forEach((worker) => {
    workers[worker.id] = 1;
  });

  return workers;
}
