import store from '@/store';

export default function (message) {
  if (store.state.debug.enabled === true) {
    console.log(message);
  }
}
