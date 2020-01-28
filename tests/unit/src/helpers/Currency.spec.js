import { createCurrency } from '@/helpers/Currency';

const TON = new createCurrency('TON');

test('short syntax', () => {
  expect(TON(1).toString()).toBe('1.00 TON');
});

test('optional shift argument', () => {
  expect(TON(100, -2).toString()).toBe('1.00 TON');
});

test('short syntax for wei (1e18) amounts', () => {
  const n = TON.wei('2110000000000000000');
  expect(n).toEqual(TON(2.11));
});

test('short syntax for rad (1e45) amounts', () => {
  const n = TON.rad('1470000000000000000000000000000000000000000000');
  expect(n).toEqual(TON(1.47));
});

test('toString prints the specified number of decimals', () => {
  const n = TON('1000.5447123');
  expect(n.toString(3)).toBe('1000.545 TON');
});
