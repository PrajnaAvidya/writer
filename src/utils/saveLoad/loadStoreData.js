import localforage from 'localforage';
import store from '@/store';

export default async function (state) {
  const stateData = JSON.parse(await localforage.getItem(`writerSaveState_${state}`));
  store.commit(`${state}/fromJSON`, stateData);
}
