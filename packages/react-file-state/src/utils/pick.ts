export const pick = <T, U extends keyof T>(object: T, keys: U[]): Pick<T, U> => {
  return keys.reduce(
    (out, key) => ({ ...out, [key]: object[key] }),
    {} as Pick<T, U>
  );
};
