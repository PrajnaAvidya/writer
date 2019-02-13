export default function ({ x, y, text, time = 500, height = 100, disappearFrom = 0.5, className = 'floating-plus' }) {
  // create and add div
  const dvPlus = document.createElement('div');
  dvPlus.className = className;
  dvPlus.innerHTML = text;
  dvPlus.style.left = `${x}px`;
  document.body.appendChild(dvPlus);

  // actually animate it
  dvPlus.animate([{
    top: `${y}px`,
    opacity: 1,
  },
  {
    top: `${y - (height * disappearFrom)}px`,
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
