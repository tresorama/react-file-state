// src/create-store.ts
import { useCallback, useEffect, useRef, useState } from "react";

// src/utils/is-equal.ts
var isEqual = (a, b) => {
  if (Object.is(a, b))
    return true;
  return JSON.stringify(a) === JSON.stringify(b);
};

// src/create-store.ts
var createStore = (initialState, derivedStateResolver, actionsCreator) => {
  let state = initialState;
  let derivedState = derivedStateResolver(initialState);
  let listeners = [];
  const get = () => state;
  const getWithDerived = () => ({ ...state, ...derivedState });
  const set = (newState) => {
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const set2 = (stateMutator) => {
    const prev = get();
    const newState = stateMutator(prev);
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const actions = actionsCreator(get, set, set2);
  const subscribe = (func) => {
    listeners.push(func);
    return () => {
      listeners = listeners.filter((x) => x !== func);
    };
  };
  const defaultSelector = (ms) => ms;
  const useStore = (selector = defaultSelector) => {
    const selectorMemoized = useCallback(selector, []);
    const lastState = useRef(selectorMemoized(getWithDerived()));
    const [state2, setState] = useState(selectorMemoized(getWithDerived()));
    useEffect(() => {
      const unsubscribe = subscribe(() => {
        const newState = selectorMemoized(getWithDerived());
        if (!isEqual(newState, lastState.current)) {
          setState(newState);
          lastState.current = newState;
        }
      });
      return () => unsubscribe();
    }, [selectorMemoized]);
    return [state2, actions];
  };
  return {
    get,
    set,
    subscribe,
    actions,
    useStore
  };
};

// src/utils/mutate.ts
var mutate = (a, massager) => {
  const clone = JSON.parse(JSON.stringify(a));
  massager(clone);
  return clone;
};

// src/utils/pick.ts
var pick = (object, keys) => {
  return keys.reduce(
    (out, key) => ({ ...out, [key]: object[key] }),
    {}
  );
};
export {
  createStore,
  mutate,
  pick
};
//# sourceMappingURL=index.js.map