import Noty from 'noty';

export default function (text, config = {}) {
  if (config.icon) {
    text = `<div style="float: left;margin-right:15px;"><i class="fas ${config.icon} fa-2x"></i></div><div style="float: left;margin-bottom:9px;">${text}</div>`;
  }
  const defaultConfig = {
    text,
    type: 'success',
    timeout: 5000,
  };
  return new Noty(Object.assign(defaultConfig, config)).show();
}
