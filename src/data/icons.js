import playerIcons from '@/data/playerIcons';

export default function () {
  const iconData = {
    playerIcon: '',
    playerIcons: [],
  };

  iconData.playerIcons = playerIcons.reverse();
  iconData.playerIcon = iconData.playerIcons.pop();

  return iconData;
}
