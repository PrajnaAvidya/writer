// load the big game data object that gets stored in vuex/local state

import playerIcons from '@/data/playerIcons';
import tutorials from '@/data/tutorials';

const data = {
  // tutorials
  tutorials: [],

  // player icons
  playerIcon: '',
  playerIcons: [],
};

export default function () {
  const stateData = Object.assign({}, data);

  // writing icons
  stateData.playerIcons = playerIcons.reverse();
  stateData.playerIcon = stateData.playerIcons.pop();

  // tutorials/unfolding
  stateData.tutorials = tutorials.reverse();

  return stateData;
}
