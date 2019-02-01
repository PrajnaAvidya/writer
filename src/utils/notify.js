import Noty from 'noty';

export default function (text, config = {}) {
  const defaultConfig = {
    text,
    type: 'success',
    timeout: 5000,
  };
  return new Noty(Object.assign(defaultConfig, config)).show();
}
