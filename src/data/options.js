import buttonSizes from '@/data/buttonSizes';

export default function () {
  const options = {
    buttonSize: 5,
  };

  options.maxButtonSize = parseInt(Object.keys(buttonSizes)[Object.keys(buttonSizes).length - 1], 10);

  return options;
}
