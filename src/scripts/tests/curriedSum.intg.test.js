import { sum } from "../sum";
import { curry } from "../curry";

describe("curried sum", () => {
  test("doesn't call curried sum without arguments", () => {
    const fns = {
      sum,
      curry
    };
    const spy = jest.spyOn(fns, "sum");
    const curriedSum = curry(sum);

    expect(spy).not.toBeCalled();
  });

  test("doesn't call curried sum with only one argument", () => {
    const fn = { sum };
    const curried = {
      add10: curry(sum)(10)
    };
    const spy = jest.spyOn(fn, "sum");

    expect(spy).not.toBeCalled();
  });

  test("curriedSum adds numbers correctly", () => {
    const add10 = curry(sum)(10);

    expect(add10(11)).toBe(21);
  });
});
