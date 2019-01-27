// calculate a worker cost
import Big from 'big.js';

export default function (baseCost, owned, costMultiplier, buyAmount) {
  return Big(baseCost).times(Big(1 + costMultiplier).pow(owned + buyAmount).minus(Big(1 + costMultiplier).pow(owned))).div(costMultiplier).round();
}
