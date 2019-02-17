import Noty from 'noty';
import store from '@/store';
import notifyIconText from '@/utils/notifyIconText';

export default function (text, config = {}) {
  if (store.state.options.notifications !== true) {
    return false;
  }

  if (config.icon) {
    text = notifyIconText(text, config.icon);
  }
  const defaultConfig = {
    text,
    type: 'success',
    timeout: 5000,
  };
  return new Noty(Object.assign(defaultConfig, config)).show();
}
