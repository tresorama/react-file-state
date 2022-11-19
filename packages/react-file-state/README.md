# React-File-State

Lightweight state management for React apps.  
One file, one store.

Visibility: Public  
Status: Development  
Version: 0.2.4  

**NOT PRODUCTION READY**

## Documentation

[View ChangeLog](https://github.com/tresorama/react-file-state/blob/main/docs/CHANGELOG.md)  
[View Documentation](https://github.com/tresorama/react-file-state/blob/main/docs/README.md)  

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
