import { sum } from "./sum";

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1,2)).toBe(3);
});

test('subtracts 2 from 5 to equal 3', () => {
  expect(sum(5,-2)).toBe(3);
});

test('returns a Number', () => {
  expect(typeof sum(1,1)).toMatch('number');
});

test('throws an error', () => {
  expect(() => sum(1,'a')).toThrow();
});
