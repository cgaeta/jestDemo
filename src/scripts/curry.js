export const curry = fn => {
  return (...args) => {
    if (fn.length <= args.length) {
      return fn.apply(null, args);
    } else {
      return curry(fn).bind(null, ...args);
    }
  }
}
