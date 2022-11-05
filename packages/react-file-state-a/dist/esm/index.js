// src/create-store.ts
import { useCallback, useEffect, useRef, useState } from "react";
var stateAreEquals = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};
var buildActionsProxied = (actions, get, set) => {
  const actionsProxied = {};
  for (let [key, value] of Object.entries(actions)) {
    const actionProvided = value;
    const actionProxied = (...args) => {
      const prevState = get();
      const newState = actionProvided(prevState, ...args);
      set(newState);
    };
    const keyTyped = key;
    actionsProxied[keyTyped] = actionProxied;
  }
  return actionsProxied;
};
var createStore = (initialState, derivedStateResolver, actions) => {
  let state = initialState;
  let derivedState = derivedStateResolver(initialState);
  const listeners = [];
  const get = () => state;
  const getWithDerived = () => ({ ...state, ...derivedState });
  const set = (newState) => {
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const actionsProxied = buildActionsProxied(actions, get, set);
  const subscribe = (func) => {
    listeners.push(func);
    return () => {
      listeners.splice(listeners.length - 1);
    };
  };
  const useStore = (selector = (ms) => ms) => {
    const selectorMemoized = useCallback(selector, []);
    const lastState = useRef(selectorMemoized(getWithDerived()));
    const [state2, setState] = useState(selectorMemoized(getWithDerived()));
    useEffect(() => {
      const unsubscribe = subscribe(() => {
        const newState = selectorMemoized(getWithDerived());
        if (!stateAreEquals(newState, lastState.current)) {
          setState(newState);
          lastState.current = newState;
        }
      });
      return () => unsubscribe();
    }, [selectorMemoized]);
    return [state2, actionsProxied];
  };
  return {
    get,
    set,
    subscribe,
    actions,
    actionsProxied,
    useStore
  };
};
export {
  createStore
};
//# sourceMappingURL=index.js.map