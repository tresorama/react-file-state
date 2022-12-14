import { useRef } from "react";
import { isEqual } from './utils/is-equal';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

const testArgumentsValidity = (...args: unknown[]) => {
  if (typeof args[0] !== 'object') {
    throw new TypeError('createStore - Error - "initialState" must be an object !');
  }
  if (!['undefined', 'function'].includes(typeof args[1])) {
    throw new TypeError('createStore - Error - "derivedStateResolver" must be a function or undefined!');
  }
  if (!['undefined', 'function'].includes(typeof args[2])) {
    throw new TypeError('createStore - Error - "actionsCreator" must be a function or undefined!');
  }
};

type Data = any;
type State = { [k: string]: Data; };
type DerivedState = { [k: string]: Data; };
type Actions = { [k: string]: (...args: any[]) => void; };

type Unsubscribe = () => void;
type Subscribe = (func: () => void) => Unsubscribe;

export const createStore = <S extends State, D extends DerivedState = DerivedState, A extends Actions = Actions>
  (
    initialState: S,
    derivedStateResolver: ((s: S) => D) = () => ({} as any),
    actionsCreator: (
      set: (newStateOrStateMutator: S | ((prevState: S) => S)) => void,
      get: () => S,
    ) => A = () => ({} as any)
  ) => {
  testArgumentsValidity(
    initialState,
    derivedStateResolver,
    actionsCreator
  );
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
  const subscribe: Subscribe = (func) => {
    listeners.push(func);
    return () => {
      listeners = listeners.filter(x => x !== func);
    };
  };
  const actions = actionsCreator(set, get);

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

