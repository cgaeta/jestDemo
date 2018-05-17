export const sum = (a, b) => {
  if (!(typeof a === "number" && typeof b === "number")) {
    throw new Error("At least one argument isn't a number");
  }
  return a + b;
};
