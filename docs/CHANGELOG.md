# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2022-11-09

### Changes

No code changes, but refactored "where" documentation and changelog lives.
Updated also documentation.

### Other 

- refactored code for `apps/app-next`.  
- add `with-zustand` example as comparison in`apps/app-compare-zustand`.  

## [0.2.0] - 2022-11-08

### Minor Changes

- `derivedStateResolver` is now optional.
- `actionsCreator` is now optional.

### Dev Changes

- add tests (ts-node, ava)
- add check arguments for `createStore`

## [0.1.1] - 2022-11-08

> Remember we are in pre v1 stage.

### Patch Changes

- Refactor subscription code to support concurrent mode
  - Migrate `useEffect` to `useSyncExternalStore`

### Dev Changes

- Added npm scripts for test, lint, check

## [0.1.0] - 2022-11-06

> Remember we are in pre v1 stage.

### Major changes

- Change `createStore` API - `actionsCreator` params
  - Removed `set` and `set2` as separated function, and merged into a unique `set`, that shares the two behavior
  - Changed order of params in `createStore.actionsCreater`
```diff
const store = createStore(
  // initial state,
  ...,
  // derived state resolver,
  ...,
  // actions creator
-  (get,set,set2) => ({
-    dec: () => {
-      const prev = get();
-      set({ count: prev.count - 1 });
-    },
-    inc: () => set2(prev => ({ ...prev, count: prev.count + 1 }));
-  })
+  (set, get) => ({
+    dec: () => {
+      const prev = get();
+      set({ count: prev.count + 1 });
+    },
+    inc: () => set(prev => ({ ...prev, count: prev.count + 1 }));
+  })
);
```

## [0.0.1] - 2022-11-06

> Remember we are in pre v1 stage.

Initial Release.

### Usage

#### 1. Create the Store

Create the store.  
You can create as many store as you want.  
A common pattern is `one file -> one store`.  
Every time you import from that file you get "that" store.  
This is the reason of the name of the library 😎 !.  

```tsx
import { createStore } from '@tresorama/react-file-state';

const counterStore = createStore(
  // initial state
  {
    count: 0
  },
  // derived state resolver
  (state) => ({
    isEmpty: state.count === 0
  }),
  // actions creator
  (get, set, set2) => ({
    inc: () => set2(prev => ({ ...prev, count: prev.count + 1 })),
    dec: () => {
      const prev = get();
      set({ ...prev, count: prev.count - 1 });
    }
  })
);

export { counterStore };

```

#### 2. Use it! - Vanilla JS

```tsx
import {counterStore} from '..';

console.log(counterStore.getWithDerived()); // { count: 0, isEmpty: true }
counterStore.actions.inc();
console.log(counterStore.getWithDerived()); // { count: 1, isEmpty: false }
```

#### 2. Use it! - React

```tsx
import {counterStore} from '..';

const CounterInHeader = () => {
  const [count, actions] = store.useStore( s => s.count );
  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={actions.inc}>Increment</button>
      <button onClick={actions.dec}>Decrement</button>
    </div>
  )
};
const CounterInFooter = () => {
  const [isEmpty, actions] = store.useStore( s => s.isEmpty );
  return (
    <div>
      <p> Is Empty: {state.isEmpty}</p>
      <button onClick={actions.inc}>Increment</button>
      <button onClick={actions.dec}>Decrement</button>
    </div>
  )
};
```

### API

### createStore

```ts
type CreateStore = <
  S extends State,
  D extends DerivedState
  A extends Actions,
>(
  initialState: S,
  derivedStateResolver: (state: S) => D,
  actionsCreator: (
    get: () => S,
    set: (newState: S) => void
    set2: (prevState: S) => S
  ) => A
) => Store;


const store = createStore (
  initialState,
  derivedStateResolver,
  actionsCreator
);

// Example
const counterStore = createStore(
  // initialState
  {
    count: 0
  },
  // derivedStateResolver
  (state) => ({
    isEmpty: state.count === 0
  }),
  // actionsCreator
  (get, set, set2) => ({
    inc: () => set2(prev => ({ ...prev, count: prev.count + 1 })),
    dec: () => {
      const prev = get();
      set({ ...prev, count: prev.count - 1 });
    },
    fetchStep: async () => {
      const step = await fetch(....);
      set2(prev => ({ ...prev, step }));
    }
  })
);
```

**Parameters**

**initialState**

Initial state of your store.

```ts
import {JsonObject, JsonArray, JsonPrimitive} from 'type-fest';

type Data = JsonObject | JsonArray | JsonPrimitive;
type State = { [k: string]: Data; };
type InitialState = State;
```

**derivedStateResolver**
A function that take your "state" as input and return a derived object.

```ts
import {JsonObject, JsonArray, JsonPrimitive} from 'type-fest';

type Data = JsonObject | JsonArray | JsonPrimitive;
type DerivedState = { [k: string]: Data; };
type DerivedStateResolver = (state: State) => DerivedState
```

**actionsCreator**
A function that receive `get`, `set`, `set2` as input return an object containing all your store actions.
An actions is a function (or async function) that internally can call `get`, `set` or `set2` for update the state.

```ts
type Actions = { 
  [k: string]: (...args: any[]) => void;
};
type ActionsCreator = (
  get: () => State,
  set: (newState:State) => void
  set2: (prevState:State) => State
) => Actions
```

**Return**

Your [store](#store).

<hr />

#### Store

```ts
type Store = {
  get: () => State,
  getDerived: () => DerivedState,
  getWithDerived: () => State & DerivedState,
  set: (newState: State) => void,
  actions: Actions,
  subscribe: () => () => void

  /* React Hook */
  useStore:  (
    selector: <T>(stateWithDerived: State & DerivedState) => T;
  ) => [T, Actions]
}

store = {
  // for Vanilla JS
  get(),            // get "state" portion only    => { count }
  getDerived(),     // get "derived" portion only  => { isEmpty }
  getWithDerived(), // get "derived" and "state"   => { count, isEmpty }
  set(),            // update state
  actions,          // actions
  subscribe(),      // pub-sub listeners, returns unsubscribe function
  // for React
  useStore()        // see below
}
```

<hr/>

#### Store.useStore

> React only feature

A react hook linked to the store.
It requires a [selector](#storeusestore---selector) as input and returns (similar to `useState` from react) an array containing the "selector" output as first item and sotre actions as second item.  

```tsx

const counterStore = createStore(
  {count: 0, step:1, name: 'Likes on post' },
  // omitted - derived state resolver
  (get,set,set2) => ({
    inc: () => ...
  })
);

type Selector = <T>(stateWithDerived: State & DerivedState) => T;

const MyComp = () => {
  const [count, actions] = store.useStore( 
    s => s.count  // 👈 selector function
  );
  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={actions.inc}>Increment</button>
    </div>
  )
}
```

<hr/>

#### Store.useStore - Selector

> React only feature

To avoid unnecessary re-render you "select" only what parts of the state you use on that component.  
This ensure that updates on other parts of the state will not re-render this component.  
In case you don't select nothing, you will receive whole state, and re-renderer on every state change.  

> **NOTE**  
> Selector function is internally memoized.  
> You don't need to do it.  
> For now is not possible to change the selector function once it's set.  

```tsx
const counterStore = createStore(
  {count: 0, step:1, name: 'Likes on post' },
  // omitted - derived state resolver
  // omitted - actions creator
);


type Selector = <T>(stateWithDerived: State & DerivedState) => T;

// Extract only "count" and re-render only on "count" updates
const MyComp = () => {
  const [count, actions] = store.useStore( 
    s => s.count  // 👈 selector function
  );
}

// Extract only "step" and re-render only on "step" updates
const MyComp = () => {
  const [step, actions] = store.useStore( s => s.step );
}

// Extract "name" and "count" and re-render when "name" or "count" updates
const MyComp = () => {
  const [ {name, count}, actions] = store.useStore( ({name, count}}) => ({ name, count}) );
}

// Extract whole state and re-render on his updates
const MyComp = () => {
  const [ state, actions] = store.useStore( );
  // or (equivalent)
  const [ state, actions] = store.useStore( s => s ); 
}
```