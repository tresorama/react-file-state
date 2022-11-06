export const mutate = <A,>(a: A, massager: (a: A) => void): A => {
  // clone
  const clone: A = JSON.parse(JSON.stringify(a));
  // let consumer massage it
  // (inside massager you must mutate directly)
  massager(clone);
  // update persistent storage
  //editorStateStorage.save(clone);
  // return
  return clone;
};