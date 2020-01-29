import BigNumber from 'bignumber.js';

function amountToBigNumber (amount) {
  if (amount instanceof Currency) return amount.toBigNumber();
  const value = BigNumber(amount);
  if (value.lt(0)) throw new Error('amount cannot be negative');
  if (value.isNaN()) throw new Error(`amount "${amount}" is not a number`);
  return value;
}

class Currency {
  constructor (amount, shift = 0, symbol) {
    if (shift === 'wei') shift = -18;
    if (shift === 'rad') shift = -45;
    this._amount = shift
      ? amountToBigNumber(amount).shiftedBy(shift)
      : amountToBigNumber(amount);
    this.symbol = symbol;
  }

  toString (decimals = 2) {
    return `${this._amount.toFixed(decimals)} ${this.symbol}`;
  }

  toFixed (shift = 0) {
    if (shift === 'wei') shift = 18;
    if (shift === 'rad') shift = 45;

    // always round down so that we never attempt to spend more than we have
    return this._amount
      .shiftedBy(shift)
      .integerValue(BigNumber.ROUND_DOWN)
      .toFixed();
  }
}

export function createCurrency (symbol) {
  const creatorFn = (amount, shift) => new Currency(amount, shift, symbol);

  Object.assign(creatorFn, {
    wei: (amount) => new Currency(amount, 'wei', symbol),
    rad: (amount) => new Currency(amount, 'rad', symbol),
  });

  return creatorFn;
}
