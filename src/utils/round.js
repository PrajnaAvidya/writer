// round/format large numbers

import Big from 'big.js';
import store from '@/store';

export default function (inputValue, userOptions = {}) {
  // get/combine default options
  const defaultOptions = {
    decimal: false, // show decimal for values under 100
    alwaysPositive: false, // don't show values below 0
    showNaN: false, // show 'NaN' instead of 0 for invalid numbers
    exponential: false, // use exp notation?
    percentFormat: false, // show 0 as <1
  };
  const options = Object.assign(defaultOptions, userOptions);

  // check if a number
  if (Number.isNaN(inputValue)) {
    return options.showNaN ? 'NaN' : 0;
  }

  // convert to big.js
  const value = Big(inputValue);

  // check if negative (not allowed in this game!)
  if (options.alwaysPositive && value.lt(0)) {
    return options.percentFormat ? '<1' : '0';
  }

  // return decimal if enabled & small enough
  if (options.decimal && value.lt(100)) {
    const decimalValue = value.toFixed(2);
    return options.percentFormat && decimalValue === 0.00 ? '<0.01' : decimalValue;
  }

  // return number for under 1M
  if (value.lt(1000000)) {
    const lowValue = Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return options.percentFormat && lowValue === '0' ? '<1' : Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // exponential option
  if (store.state.options.scientificNotation || options.exponential) {
    return value.toExponential(3);
  }

  // show regular suffix for under 1E36
  if (value.lt('1E36')) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dec'];
    const suffix = suffixes[Math.floor((value.e) / 3)];

    const sigFig = value.e % 3;
    value.e = 3 + sigFig;

    return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
  }

  // show double suffix for under 1E303
  if (value.lt('1E303')) {
    const bigSuffixes = ['Dec', 'Vig', 'Tri', 'Qua', 'Qui', 'Sex', 'Sep', 'Oct', 'Non'];
    const littleSuffixes = ['U-', 'D-', 'T-', 'Qa-', 'Qi-', 'Sx-', 'Sp-', 'Oc-', 'No-', ''];

    const bigIndex = Math.floor((value.e - 33) / 30);
    const littleIndex = (Math.floor((value.e - 33) / 3) - 1) % 10;
    const suffix = `${littleSuffixes[littleIndex]}${bigSuffixes[bigIndex]}`;

    const sigFig = value.e % 3;
    value.e = 3 + sigFig;

    return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
  }

  // TODO suffix for over 1E303

  // return exponential because we've exhausted other options
  return value.toExponential(3);
}
