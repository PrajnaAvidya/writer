const playerIcons = [
  'fa-feather-alt',
  'fa-pencil-alt',
  'fa-pen',
  'fa-keyboard',
  'fa-laptop',
  'fa-desktop',
  'fa-hand-holding-usd',
];

export default function () {
  const iconData = {
    playerIcon: '',
    playerIcons: [],
  };

  iconData.playerIcons = playerIcons.reverse();
  iconData.playerIcon = iconData.playerIcons.pop();

  return iconData;
}
