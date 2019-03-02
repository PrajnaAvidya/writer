import log from '@/utils/log';
import loadStoreData from '@/utils/saveLoad/loadStoreData';
import saveStores from '@/data/saveLoad/saveStores';

export default async function () {
  const loadStates = [];
  saveStores.forEach((state) => {
    loadStates.push(loadStoreData(state));
  });

  await Promise.all(loadStates);
  log('game loaded');
}
