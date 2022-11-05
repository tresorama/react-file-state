export const isEqual = <T>(a: T, b: T) => {
  if (Object.is(a, b)) return true;
  return JSON.stringify(a) === JSON.stringify(b);
};
