import store from '@/store';

export default function (message) {
  if (store.state.game.debug.enabled === true) {
    console.log(message);
  }
}
