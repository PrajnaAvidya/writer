import log from '@/utils/log';
import version from '@/data/saveLoad/version';
import four from '@/utils/saveLoad/upgrade/4';

export default function (saveData) {
  let upgraded = false;
  if (saveData.version < version) {
    log(`upgrading save from version ${saveData.version}`);

    if (saveData.version === 3) {
      four();
      saveData.version = 4;
    }

    upgraded = true;
  }

  return upgraded;
}
