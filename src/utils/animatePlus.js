import round from '@/utils/round';

export default function ({ x, y, value, time = 500, height = 100, disappearFrom = 0.5 }) {
  // create and add div
  const dvPlus = document.createElement('div');
  dvPlus.className = 'floating-plus';
  dvPlus.innerHTML = `+${round(value)}`;
  dvPlus.style.left = `${x - (dvPlus.offsetWidth >> 1)}px`;
  document.body.appendChild(dvPlus);

  // actually animate it
  dvPlus.animate([{
    top: `${y}px`,
    opacity: 1,
  },
  {
    top: `${y - ~~(height * disappearFrom)}px`,
    opacity: 1,
    offset: disappearFrom,
  },
  {
    top: `${y - height}px`,
    opacity: 0,
  }], time).onfinish = (event) => {
    dvPlus.parentElement.removeChild(dvPlus);
  };
}
