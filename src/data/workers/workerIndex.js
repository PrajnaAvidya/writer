// generate an object of workerId:value for various purposes

import workers from '@/data/workers/data';

export default function (value) {
  const object = {};
  workers.forEach((worker) => {
    object[worker.id] = value;
  });
  return object;
}
