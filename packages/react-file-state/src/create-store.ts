import { useCallback, useEffect, useRef, useState } from "react";
import type { JsonArray, JsonObject, JsonPrimitive } from "type-fest";
import { isEqual } from './utils/is-equal';

type Data = JsonObject | JsonArray | JsonPrimitive;
type State = { [k: string]: Data; };
type DerivedState = { [k: string]: Data; };
type Actions = { [k: string]: (...args: any[]) => void; };

export const createStore = <S extends State, D extends DerivedState, A extends Actions>
  (
    initialState: S,
    derivedStateResolver: (s: S) => D,
    actionsCreator: (
      get: () => S,
      set: (newState: S) => void,
      set2: (stateMutator: (prevState: S) => S) => void
    ) => A
  ) => {
  let state = initialState;
  let derivedState = derivedStateResolver(initialState);
  let listeners: (() => void)[] = [];
  const get = () => state;
  const getDerived = () => derivedState;
  const getWithDerived = () => ({ ...state, ...derivedState });
  const set = (newState: S) => {
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const set2 = (stateMutator: (prev: S) => S) => {
    const prev = get();
    const newState = stateMutator(prev);
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const actions = actionsCreator(get, set, set2);
  const subscribe = (func: () => void) => {
    listeners.push(func);
    return () => {
      listeners = listeners.filter(x => x !== func);
    };
  };

  type Selector<U> = (ms: S & D) => U;
  const defaultSelector = (ms: S & D) => ms as any;
  const useStore = <U>(selector: Selector<U> = defaultSelector) => {
    const selectorMemoized = useCallback(selector, []);
    const lastState = useRef(selectorMemoized(getWithDerived()));
    const [state, setState] = useState(selectorMemoized(getWithDerived()));
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

    return [state, actions] as const;
  };
  return {
    get,
    getDerived,
    getWithDerived,
    set,
    subscribe,
    actions,
    useStore
  };
};

