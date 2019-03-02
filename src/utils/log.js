import store from '@/store';

export default function (...items) {
  if (store.state.debug.enabled === true) {
    console.log(...items);
  }
}
