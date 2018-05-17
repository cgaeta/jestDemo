import { sum } from "./sum";

describe("sum", () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1,2)).toBe(3);
  });

  test('adds 2 + 2 to equal 4', () => {
    expect(sum(2,2)).toBe(4);
  })

  test('subtracts 2 from 5 to equal 3', () => {
    expect(sum(5,-2)).toBe(3);
  });

  test('returns a Number', () => {
    expect(typeof sum(1,1)).toMatch('number');
  });

  test('throws an error', () => {
    expect(() => sum(1,'a')).toThrow();
  });
})
