import test from 'ava';
import { createStore } from './create-store';

// =======================================
// createStore()
// =======================================

test('createStore - with no args - should not create store ', t => {
  t.throws(() => {
    createStore();
  });
});
test('createStore - with 1 args - should create store', t => {
  t.notThrows(() => {
    createStore(
      { count: 1 },
    );
  });
});
test('createStore - with 1st args not object - should not create store', t => {
  t.throws(() => {
    createStore(
      'NOT OBJECT',
    );
  });
});
test('createStore - with 2 args - should create store', t => {
  t.notThrows(() => {
    createStore(
      { count: 1 },
      () => ({}),
    );
  });
});
test('createStore - with 2nd arg not function - should not create store', t => {
  t.throws(() => {
    createStore(
      { count: 1 },
      "NOT FUNCTION , NOT UNDEFINED"
    );
  });
});
test('createStore - with 3nd arg not function - should not create store', t => {
  t.throws(() => {
    createStore(
      { count: 1 },
      () => ({}),
      "NOT FUNCTION, NOT UNDEFINED"
    );
  });
});
test('createStore - with empty object, function that return void, function that return void - should create store', t => {
  t.notThrows(() => {
    createStore(
      {},
      () => { },
      () => { },
    );
  });
});

// =======================================
// createStore()
// =======================================
test('store - getDerived() equal to undefined if derivedStateResolver return void', t => {
  const store = createStore(
    { count: 1 },
    () => { },
    () => { },
  );
  t.deepEqual(store.getDerived(), undefined);
});

test('store - getWithDerived() should be equal to get() if derivedStateResolver return void', t => {
  const store = createStore(
    { count: 1 },
    () => { },
    () => { },
  );
  t.deepEqual(store.getWithDerived(), store.get());
});


// =======================================
// store.set()
// =======================================

test('store.set - should mutate state correctly', t => {
  const store = createStore(
    { count: 0 },
  );

  store.set({ count: 2 });
  t.deepEqual(store.getWithDerived(), { count: 2 });

  store.set(prev => ({ ...prev, count: prev.count + 10 }));
  t.deepEqual(store.getWithDerived(), { count: 12 });
});
// =======================================
// store.get()
// =======================================
test('store.get - without derived state - should return state correctly', t => {
  const store = createStore(
    { count: 0 },
  );

  t.deepEqual(store.get(), { count: 0 });
  t.deepEqual(store.getDerived(), {});
  t.deepEqual(store.getWithDerived(), { count: 0 });
});
test('store.get - with derived state - should return state correctly', t => {
  const store = createStore(
    { count: 0 },
    (s) => ({ isEmpty: s.count === 0 })
  );

  t.deepEqual(store.get(), { count: 0 });
  t.deepEqual(store.getDerived(), { isEmpty: true });
  t.deepEqual(store.getWithDerived(), { count: 0, isEmpty: true });
});

// =======================================
// store.actions
// =======================================
test('store.actions - sync - set() should mutate state correctly', t => {
  const store = createStore(
    { count: 0 },
    undefined,
    (set) => ({
      inc: () => set(prev => ({ ...prev, count: prev.count + 1 })),
      reset: () => set({ count: 0 })
    })
  );
  store.actions.inc();
  t.deepEqual(store.getWithDerived(), { count: 1 });

  store.actions.reset();
  t.deepEqual(store.getWithDerived(), { count: 0 });
});
test('store.actions - async - set() should mutate state correctly', async (t) => {
  const store = createStore(
    { count: 123 },
    undefined,
    (set) => ({
      waitThenReset: async () => {
        const sleep = (time: number) => new Promise(res => setTimeout(res, time));
        await sleep(2000);
        set({ count: 0 });
      }
    })
  );
  t.deepEqual(store.getWithDerived(), { count: 123 });
  await store.actions.waitThenReset();
  t.deepEqual(store.getWithDerived(), { count: 0 });
});
