import { useRef } from "react";
import type { JsonArray, JsonObject, JsonPrimitive } from "type-fest";
import { isEqual } from './utils/is-equal';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

type Data = JsonObject | JsonArray | JsonPrimitive;
type State = { [k: string]: Data; };
type DerivedState = { [k: string]: Data; };
type Actions = { [k: string]: (...args: any[]) => void; };

export const createStore = <S extends State, D extends DerivedState, A extends Actions>
  (
    initialState: S,
    derivedStateResolver: (s: S) => D,
    actionsCreator: (
      set: (newStateOrStateMutator: S | ((prevState: S) => S)) => void,
      get: () => S,
    ) => A
  ) => {
  let state = initialState;
  let derivedState = derivedStateResolver(initialState);
  let listeners: (() => void)[] = [];
  const get = () => state;
  const getDerived = () => derivedState;
  const getWithDerived = () => ({ ...state, ...derivedState });
  const set = (newStateOrStateMutator: S | ((prevState: S) => S)) => {
    let newState: S;
    if (typeof newStateOrStateMutator === 'function') {
      const prevState = get();
      newState = newStateOrStateMutator(prevState);
    }
    else {
      newState = newStateOrStateMutator;
    }
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const actions = actionsCreator(set, get);
  const subscribe = (func: () => void) => {
    listeners.push(func);
    return () => {
      listeners = listeners.filter(x => x !== func);
    };
  };

  type Selector<U> = (ms: S & D) => U;
  const defaultSelector = (ms: S & D) => ms as any;
  const useStore = <U>(selector: Selector<U> = defaultSelector) => {
    const initialServerState = useRef(getWithDerived());
    const state = useSyncExternalStoreWithSelector(
      subscribe,
      getWithDerived,
      () => initialServerState.current,
      selector,
      isEqual,
    );
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

