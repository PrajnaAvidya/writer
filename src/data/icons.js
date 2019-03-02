
export default function () {
  const iconData = {
    playerIcon: '',
    playerIcons: [
      'fa-feather',
      'fa-feather-alt',
      'fa-pencil-alt',
      'fa-pen',
      'fa-pen-alt',
      'fa-pen-fancy',
      'fa-keyboard',
      'fa-laptop',
      'fa-desktop',
      'fa-hand-holding-usd',
    ].reverse(),
  };

  iconData.playerIcon = iconData.playerIcons.pop();

  return iconData;
}
