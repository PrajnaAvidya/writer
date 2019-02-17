import Vue from 'vue';
import localforage from 'localforage';
import log from '@/utils/log';
import saveStores from '@/data/saveStores';

export default async function () {
  const deletes = [];
  await localforage.removeItem('writerSave');
  saveStores.forEach((state) => {
    deletes.push(localforage.removeItem(`writerSaveState_${state}`));
  });

  await Promise.all(deletes);
  log('hard reset');
  Vue.$ga.event({
    eventCategory: 'Game',
    eventAction: 'Hard Reset',
  });
}
