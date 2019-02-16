import Vue from 'vue';
import localforage from 'localforage';
import store from '@/store';
import unixTimestamp from '@/utils/unixTimestamp';
import log from '@/utils/log';
import saveStores from '@/data/saveStores';

export default async function () {
  const saveData = {};
  saveData.version = 2;
  saveData.timestamp = unixTimestamp();
  saveData.stores = [];
  Object.keys(store.state).forEach((state) => {
    saveData.stores.push(state);
  });

  // save main file
  await localforage.setItem('writerSave', saveData);
  // save vuex stores
  const saveStates = [];
  saveStores.forEach((state) => {
    saveStates.push(localforage.setItem(`writerSaveState_${state}`, JSON.stringify(store.state[state])));
  });

  await Promise.all(saveStates);
  log('game saved');
  Vue.$ga.event({
    eventCategory: 'Game',
    eventAction: 'Save',
  });
}
