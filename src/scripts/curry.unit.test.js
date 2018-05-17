import { curry } from "./curry";
import { getChangedFilesForRoots, findRepos } from "jest-changed-files";

describe("curry", () => {
  test("returns a function", () => {
    const fn = jest.fn((arg1, arg2) => true);

    expect(typeof curry(fn)).toMatch("function");
  });

  test("doesn't call curried function with only 1 argument", () => {
    const fn = jest.fn((arg1, arg2) => true);
    const curriedFn = curry(fn);
    const curriedW1 = curriedFn(1);

    expect(fn).not.toBeCalled();
  });

  test("calls curried function with second argument", () => {
    const fn = jest.fn((arg1, arg2) => true);
    const curriedFn = curry(fn);
    const curriedW1 = curriedFn(1);
    curriedW1(2);

    expect(fn).toBeCalled();
  });

  test("calls curried function with both arguments passed", () => {
    const fn = jest.fn((arg1, arg2) => true);
    const curriedFn = curry(fn);
    curriedFn(1,2);

    expect(fn).toBeCalled();
  })

  test("arguments are 1 and 2", () => {
    const fn = jest.fn((arg1, arg2) => true);
    const curriedFn = curry(fn);
    const curriedW1 = curriedFn(1);
    curriedW1(2);

    expect(fn).toBeCalledWith(1, 2);
  });
})
