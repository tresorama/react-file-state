export const pick = <T, U extends keyof T>(object: T, keys: U[]): Pick<T, U> => {
  return keys.reduce(
    (out, key) => ({ ...out, [key]: object[key] }),
    {} as Pick<T, U>
  );
};

export const mutate = <A,>(a: A, massager: (a: A) => void): A => {
  // clone
  const clone: A = JSON.parse(JSON.stringify(a));
  // let consumer massage it
  // (inside massager you must mutate directly)
  massager(clone);
  // return
  return clone;
};