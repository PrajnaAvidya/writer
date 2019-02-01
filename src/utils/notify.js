import Noty from 'noty';
import notifyIconText from '@/utils/notifyIconText';

export default function (text, config = {}) {
  if (config.icon) {
    text = notifyIconText(text, config.icon);
  }
  console.log(text);
  const defaultConfig = {
    text,
    type: 'success',
    timeout: 5000,
  };
  return new Noty(Object.assign(defaultConfig, config)).show();
}
