import Big from 'big.js';

export default {
  // global round/format function
  round(value, decimal = false) {
    if (Number.isNaN(value)) {
      return 0;
    }

    value = Big(value);

    if (decimal && value < 100) {
      return value.toFixed(1);
    }

    if (value <= 999) {
      return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /*
    // TOOD exponential option
    if (Options.state.notation && value.lt('1E303')) {
        return value.toExponential(3);
    }
    */

    if (value.lt('1E36')) {
      const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dec'];
      const suffix = suffixes[Math.floor((value.e) / 3)];
      const sigFig = (value.e % 3);
      value.e = 3 + sigFig;
      return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
    }

    if (value.lt('1E303')) {
      // TODO
      const bigSuffixes = ['Dec', 'Vig', 'Tri', 'Qua', 'Qui', 'Sex', 'Sep', 'Oct', 'Non'];
      const littleSuffixes = ['U', 'D', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', ''];

      const bigIndex = Math.floor((value.e - 33) / 30);
      const littleIndex = (Math.floor((value.e - 33) / 3) - 1) % 10;
      const suffix = littleSuffixes[littleIndex] + bigSuffixes[bigIndex];

      const sigFig = value.e % 3;
      value.e = 3 + sigFig;

      return `${value.div(1000).toPrecision(4 + sigFig)} ${suffix}`;
    }

    return '∞';
  },

  // TODO use this for buzz and stuff
  unixTimestamp() {
    return Math.round((new Date()).getTime() / 1000);
  },
};
