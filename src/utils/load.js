import localforage from 'localforage';
import store from '@/store';
import log from '@/utils/log';
import saveStores from '@/data/saveStores';

async function loadStoreData(state) {
  const stateData = JSON.parse(await localforage.getItem(`writerSaveState_${state}`));
  store.commit(`${state}/fromJSON`, stateData);
}

export default async function () {
  const loadStates = [];
  saveStores.forEach((state) => {
    loadStates.push(loadStoreData(state));
  });

  await Promise.all(loadStates);
  log('game loaded');
}
