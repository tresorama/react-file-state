# Table of Contents
- [Usage](#usage)
  - [Create the Store](#1-create-the-store)
  - [Use it (Vanilla JS)](#2-use-it---vanilla-js)
  - [Use it (React JS)](#2-use-it---react)
- [API](#api)
  - [`createStore`](#createstore)
  - [`Store`](#store)
    - [`useStore`](#storeusestore)
      - [`Selector`](#storeusestore---selector)
    - [`get`](#storeget)
    - [`getDerived`](#storegetderived)
    - [`getWithDerived`](#storegetwithderived)
    - [`actions`](#storeactions)
    - [`subscribe`](#storesubscribe)
- [Recipe - Local Storage](#recipe---localstorage)
- [Real World Example](#real-world-example)



## Usage

### 1. Create the Store

Create the store.  
You can create as many store as you want.  
A common pattern is `one file -> one store`.  
Every time you import from that file you get "that" store.  
This is the reason of the name of the library 😎 !  

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
  ( set, get ) => ({
    inc: () => set(prev => ({ ...prev, count: prev.count + 1 })),
    dec: () => {
      const prev = get();
      set({ ...prev, count: prev.count - 1 });
    },
    fetchStep: async () => {
      const step = await fetch(....);
      set(prev => ({ ...prev, step }));
    }
  })
);

export { counterStore };
```

### 2. Use it! - Vanilla JS

```tsx
import {counterStore} from '..';

console.log(counterStore.getWithDerived()); // { count: 0, isEmpty: true }
counterStore.actions.inc();
console.log(counterStore.getWithDerived()); // { count: 1, isEmpty: false }
```

### 2. Use it! - React

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

## API

## createStore

Type: `function`  

Function used to create a [`Store`](#store).

```ts
import { JsonObject, JsonArray, JsonPrimitive } from 'type-fest';
type Data = JsonObject | JsonArray | JsonPrimitive;

type State = { [k: string]: Data; };
type DerivedState = { [k: string]: Data; };
type Actions = { [k: string]: (...args: any[]) => void; };

type CreateStore = <
  S extends State,
  D extends DerivedState
  A extends Actions,
>(
  initialState: S,
  derivedStateResolver: undefined | (state: S) => D,
  actionsCreator: undefined | (
    set: (newStateOrStateMutator: S | ((prevState: S) => S) ) => void
    get: () => S,
  ) => A
) => Store;
```

Example

```ts
// Dummy usage
const store = createStore (
  initialState,
  derivedStateResolver,
  actionsCreator
);

// Example Usage
const exampleStore = createStore(
  
  // initialState
  { count: 0 },
  
  // derivedStateResolver
  (state) => ({
    isEmpty: state.count === 0
  }),
  
  // actionsCreator
  (set, get) => ({
    inc: () => set(prev => ({ ...prev, count: prev.count + 1 })),
    dec: () => {
      const prev = get();
      set({ ...prev, count: prev.count - 1 });
    },
    fetchStep: async () => {
      const step = await fetch(....);
      set(prev => ({ ...prev, step }));
    }
  })

);
```

### Returns

A [Store](#store).  

### Parameters

#### initialState

Type: `object`  
Required: Yes  

Initial state of your store.  

```ts
import {JsonObject, JsonArray, JsonPrimitive} from 'type-fest';

type Data = JsonObject | JsonArray | JsonPrimitive;
type State = { [k: string]: Data; };
type InitialState = State;
```

#### derivedStateResolver

Type: `function` or `undefined`.  
Required: No  

A function that take your "state" as input and return a derived object.  

```ts
import {JsonObject, JsonArray, JsonPrimitive} from 'type-fest';

type Data = JsonObject | JsonArray | JsonPrimitive;
type DerivedState = { [k: string]: Data; };
type DerivedStateResolver = (state: State) => DerivedState
```

#### actionsCreator

Type: `function` or `undefined`.  
Required: No  

A function that receive `set`, `get` as input return an object containing all your store actions.  

An action is a function (or async function) that internally can :
- trigger a side effects
- update the store by invoking `get`, `set`.
- trigger a side effect + update the store

```ts
type Actions = { 
  [k: string]: (...args: any[]) => void;
};
type ActionsCreator = (
  set: (newStateOrStateMutator: State | ((prevState: State) => State) ) => void
  get: () => State,
) => Actions
```

<hr />

### Store

```ts
type Store = {
  /* for Vanilla Js */
  get: Get,
  getDerived: GetWithDerived,
  getWithDerived: GetWithDerived,
  set: Set,
  actions: Actions,
  subscribe: Subscribe,

  /* React Hook */
  useStore: UseStore
}
```

The store is an object that contain the state, derived state, and actions.  
It exposes function used to read and update the state, 
and a React Hook `useStore`.

<hr/>

#### Store.useStore

> React only feature

A react hook linked to the store.
It requires a [selector](#storeusestore---selector) as input and returns (similar to `useState` from react) an array containing the "selector" output as first item and store actions as second item.  

```tsx

// example store
const counterStore = createStore(
  {count: 0, step:1, name: 'Likes on post' },
  // ... ,
  ( set, get ) => ({
    inc: () => set(prev => ({...prev, count: prev.count + prev.step }))
  })
);

// useStore usage
const MyComp = () => {
  const [count, actions] = store.useStore( s => s.count );
  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={actions.inc}>Increment</button>
    </div>
  )
}
```

<hr/>

##### Store.useStore - Selector

```ts
type Selector = <T>(stateWithDerived: State & DerivedState) => T;
```

To avoid unnecessary re-render you "select" only what parts of the state you use on that component.  
This ensure that updates on other parts of the state will not re-render this component.  
In case you don't select nothing, you will receive whole state, and re-renderer on every state change.  

> **NOTE**  
> Selector function is internally memoized.  
> You don't need to do it.  
> Is not possible to change the selector function once it's set.  

```tsx
// example store
const counterStore = createStore(
  {count: 0, step:1, name: 'Likes on post' },
  // ...
);

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

##### Store.get

```ts
type Get = () => State
```

##### Store.getDerived

```ts
type GetDerived = () => DerivedState
```

##### Store.getWithDerived

```ts
type GetWithDerived = () => State & DerivedState
```

##### Store.set

```ts
type StateMutator = (prevState: State) => State;
type Set = (newStateOrStateMutator: State | StateMutator ) => State
```

##### Store.actions

```ts
type Actions = {
  [k:string]: (...args: any[]) => void
}
```

##### Store.subscribe

```ts
type Unsubscribe = () => void;
type Subscribe = (func: () => void) => Unsubscribe;
```


## Recipe - localStorage

In near feature will be released an API for supporting cache storage natively.

Until that moment, you can adapt this suggested pattern to your app.

1. Create utils for the cache storage

```tsx
// in /utils/is-browser.ts

// Utility for knowing which env is running the code
// This is used support SSR.
const isDOM = Boolean(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement
);

export const isServer = !isDOM;
export const isBrowser = isDOM;
```

```tsx
// in /utils/simple-storage.ts

// Utility - localStorage entry manager
export class SimpleStorage<T>{
  /** Unique identifier of this resource in the storage database */
  key: string;
  constructor(
    /** Unique identifier of this resource in the storage database */
    key: string
  ) {
    this.key = key;
  }
  serialize(data: T) { return JSON.stringify(data); }
  deserialize(serializedData: string) { return JSON.parse(serializedData) as T; }
  get() {
    const serializedData = window.localStorage.getItem(this.key);
    if (serializedData === null) return null;
    return this.deserialize(serializedData);
  }
  save(data: T) {
    const serializedData = this.serialize(data);
    window.localStorage.setItem(this.key, serializedData);
  }
  destroy() {
    window.localStorage.removeItem(this.key);
  }
}
```

2. Add cache layer to your store

```ts
// in /your-store.ts

import { isBrowser } from '../utils/is-browser';
import { SimpleStorage } from '../utils/simple-storage';

// State Types + initialState
type StoreState = { ... };
const initialState: StoreState = { ... };

// cache layer
const storeCache = new SimpleStorage<StoreState>('my-fancy-store-state');

// store
const store = createStore(
  Object.assign(
    initialState,
    { isHydrated: false }// flag to be used in your views to show a "stale" / "loading" view
  ),
  () => {...}, // derived state resolver
  () => {...}, // actions creator
);

// Subscribe to store changes only on Browser env.
// On server env (SSR) skip this.
if (isBrowser) {
  // on store changes save to cache layer
  store.subscribe(
    () => storeCache.save(store.get())
  );
}

// Create a React Component that triggers "store hydration"
// after first render
// We must wait that first render occurs to prevent
// Server and client render mismatch.
const StoreInitializer = () => {

  React.useEffect(() => {
    // retrieve store state from cache layer and hydrate store (if exists)
    const cached = cacheStorage.get();
    if (cached) store.set({...cached, isHydrated: true });
    else store.set(prev => ({...prev, isHydrated: true }));
  }, []);
  
  return <>{null}</>; // Empty React Fragment
}
```

3. Then in your app tree

```tsx
// in /app.ts

const App = () => (
  // ... rest of your app
  <StoreInitializer />
  //... rest of your app
);
```

## Real World Example

1. Create a Store (you can create as many store es you want)

```tsx
import { createStore, mutate } from '@tresorama/react-file-state';

// Entity - types
type Variant = {
  colorA_hue: number;
  colorA_start: number;
  colorB_hue: number;
  gradient_angle: number;
};
type EditorState = {
  current_variant_index: number;
  variants: Variant[];
  draftVariant: null | Variant;
};

// Entity - initial state
const initialState: EditorState = {
  current_variant_index: 0,
  variants: [
    {
      colorA_hue: 0,
      colorA_start: 0,
      colorB_hue: 0,
      gradient_angle: 0
    },
    {
      colorA_hue: 0,
      colorA_start: 52,
      colorB_hue: 300,
      gradient_angle: 314
    },
    {
      colorA_hue: 60,
      colorA_start: 52,
      colorB_hue: 220,
      gradient_angle: 314
    },
    {
      colorA_hue: 40,
      colorA_start: 52,
      colorB_hue: 300,
      gradient_angle: 314
    },
    {
      colorA_hue: 286,
      colorA_start: 47,
      colorB_hue: 200,
      gradient_angle: 59
    }
  ],
  draftVariant: null
};

// Utility - Mutate directly an object (similar to immer)
export const mutate = <A,>(a: A, massager: (a: A) => void): A => {
  // clone
  const clone: A = JSON.parse(JSON.stringify(a));
  // let consumer massage it
  // (inside massager you must mutate directly)
  massager(clone);
  // return
  return clone;
};

//  Store
export const editorStore = createStore(
  initialState,
  (state) => ({
    show_production_variant: state.current_variant_index === 0,
    variant: state.variants[state.current_variant_index],
    isEditing: state.draftVariant !== null,
    serialized_state: JSON.stringify(state)
  }),
  (set) => ({
    goNextVariant: () => set(prev => {
      const newIndex = Math.min(
        prev.current_variant_index + 1,
        prev.variants.length - 1
      );
      return { ...prev, current_variant_index: newIndex };
    }),
    goPrevVariant: () => set(prev => {
      const newIndex = Math.max(prev.current_variant_index - 1, 0);
      const newState = { ...prev, current_variant_index: newIndex };
      return newState;
    }),
    deleteCurrentVariant: () => set(prev => {
      const newState = mutate(prev, (prev) => {
        if (prev.variants.length <= 2) return; // abort
        prev.variants.splice(prev.current_variant_index, 1);
        prev.current_variant_index = Math.min(
          prev.current_variant_index,
          prev.variants.length - 1
        );
      });
      return newState;
    }),
    enableEditing: () => set(prev => {
      return {
        ...prev,
        draftVariant: { ...prev.variants[prev.current_variant_index] }
      };
    }),
    disableEditing: () => set(prev => {
      return { ...prev, draftVariant: null };
    }),
    setDraftValues: (key: keyof Variant, value: Variant[typeof key]) => set(prev => {
      if (prev.draftVariant === null) return prev;
      const draftVariant = { ...prev.draftVariant, [key]: value };
      return { ...prev, draftVariant };
    }),
    saveDraftAsNewVariant: () => set(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.push(prev.draftVariant);
        prev.current_variant_index = prev.variants.length - 1;
      });
    }),
    saveDraftOverwritingVariant: () => set(prev => {
      return mutate(prev, (prev) => {
        if (prev.draftVariant === null) return;
        prev.variants.splice(prev.current_variant_index, 1, prev.draftVariant);
      });
    })
  })
);

```

2. Use the store 
```tsx
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { editorStore } from '../../store/editor-store';
import hash from 'hash-sum';


export const VariantsReel = () => {
  const [{ variants }] = editorStore.useStore((({ variants }) => ({ variants })));
  return (
    <Flex wrap="wrap" gap="10" p="10">
      <VariantDraftCard />
      {variants.map((variant, i) => (
        <VariantCard
          key={hash(i + JSON.stringify(variant))}
          index={i}
        />
      ))}
    </Flex>
  );
};

const VariantDraftCard = () => {
  const [draftVariant] = editorStore.useStore(s => s.draftVariant);
  return draftVariant ? (
    <ViewVariantCard title="Draft" variant={draftVariant} />
  ) : (
    <ViewVariantCardNull title="Draft" />
  );
};
const VariantCard = ({ index }: { index: number; }) => {
  const [variant] = editorStore.useStore((s => s.variants[index]));
  if (!variant) return <>Nyllllll</>;
  return <ViewVariantCard title={`Variant ${index + 1}`} variant={variant} />;
};

type Variant = ReturnType<typeof editorStore.get>['variants'][number];

const ViewVariantCard = ({ title, variant }: { title: React.ReactNode; variant: Variant; }) => (
  <Box
    flexBasis="200px"
    border="2px"
    borderColor="whiteAlpha.500"
    borderRadius="base"
  >
    <Box px="2" py="2" bg="whiteAlpha.200" fontSize="lg" fontWeight="medium">
      {title}
    </Box>
    {[
      ["A", variant.colorA_hue],
      ["A Start", variant.colorA_start],
      ["B", variant.colorB_hue],
      ["Angle", variant.gradient_angle],
    ].map(([label, value]) => (
      <Flex key={label} borderBottom="2px" borderColor="whiteAlpha.200">
        <Box flex="5" px="2" py="1" >{label}</Box>
        <Box flex="7" px="2" py="1">{value}</Box>
      </Flex>
    ))}
  </Box>
);

const ViewVariantCardNull = ({ title }: { title: React.ReactNode; }) => (
  <Box
    flexBasis="200px"
    border="2px"
    borderColor="whiteAlpha.500"
    borderRadius="base"
  >
    <Box px="2" py="2" bg="whiteAlpha.200" fontSize="lg" fontWeight="medium">{title}</Box>
    <Flex borderBottom="2px" borderColor="whiteAlpha.200">
      <Box px="2" py="1" >Null</Box>
    </Flex>
  </Box>
);
```
