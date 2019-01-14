import Big from 'big.js';

export default {
  // global round/format function
  round(value, userOptions = {}) {
    // get/combine default options
    const defaultOptions = {
      decimal: false, // show decimal for values under 100
      alwaysPositive: false, // don't show values below 0
      showNaN: false, // show 'NaN' instead of 0 for invalid numbers
    };
    const options = Object.assign(defaultOptions, userOptions);

    // check if a number
    if (Number.isNaN(value)) {
      return options.showNaN ? 'NaN' : 0;
    }

    // convert to big.js
    value = Big(value);

    // check if negative
    if (options.alwaysPositive && value.lt(0)) {
      return 0;
    }

    // return decimal if under 100
    if (options.decimal && value.lt(100)) {
      return value.toFixed(1);
    }

    // return number for under 1000
    if (value.lt(1000)) {
      return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /*
    // TOOD exponential option
    if (Options.state.notation && value.lt('1E303')) {
        return value.toExponential(3);
    }
    */

    // show regular suffix for under 1E36
    if (value.lt('1E36')) {
      const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dec'];
      const suffix = suffixes[Math.floor((value.e) / 3)];
      const sigFig = (value.e % 3);
      value.e = 3 + sigFig;
      return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
    }

    // show double suffix for under 1E303
    if (value.lt('1E303')) {
      const bigSuffixes = ['Dec', 'Vig', 'Tri', 'Qua', 'Qui', 'Sex', 'Sep', 'Oct', 'Non'];
      const littleSuffixes = ['U', 'D', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', ''];

      const bigIndex = Math.floor((value.e - 33) / 30);
      const littleIndex = (Math.floor((value.e - 33) / 3) - 1) % 10;
      const suffix = littleSuffixes[littleIndex] + bigSuffixes[bigIndex];

      const sigFig = value.e % 3;
      value.e = 3 + sigFig;

      return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
    }

    // number is basically infinity at this point
    return '∞';
  },

  // TODO use this for buzz and stuff
  unixTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
  },
};
