import loadStoreData from '@/utils/loadStoreData';
import log from '@/utils/log';
import saveStores from '@/data/saveStores';

export default async function () {
  const loadStates = [];
  saveStores.forEach((state) => {
    loadStates.push(loadStoreData(state));
  });

  await Promise.all(loadStates);
  log('game loaded');
}
