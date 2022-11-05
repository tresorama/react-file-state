import { useCallback, useEffect, useRef, useState } from "react";
import type { JsonArray, JsonObject, JsonPrimitive } from "type-fest";
type GetParameters<F> = F extends (...args: any) => any ? Parameters<F> : never;
type RemoveFirstArrayItem<T extends any[]> = ((...p: T) => void) extends ((p1: infer P1, ...rest: infer R) => void) ? R : never;

type Data = JsonObject | JsonArray | JsonPrimitive;
type State = { [k: string]: Data; };
type DerivedState = { [k: string]: Data; };
type Actions<S> = {
  [k: string]: (prevState: S, ...args: any[]) => S;
};
type ActionsProxied<A extends Actions<any>> = Record<
  keyof A,
  (...args: RemoveFirstArrayItem<GetParameters<A[keyof A]>>) => void
>;



const stateAreEquals = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b);
};


const buildActionsProxied = <S extends State, A extends Actions<S>>(
  actions: A,
  get: () => S,
  set: (newState: S) => void
): ActionsProxied<A> => {
  const actionsProxied = {} as ActionsProxied<A>;
  for (let [key, value] of Object.entries(actions)) {
    const actionProvided = value;
    const actionProxied = (...args: any[]) => {
      const prevState = get();
      const newState = actionProvided(prevState, ...args);
      set(newState);
    };
    const keyTyped: keyof A = key;
    actionsProxied[keyTyped] = actionProxied;
  }
  return actionsProxied;
};



export const createStore = <
  S extends State,
  D extends DerivedState,
  A extends Actions<S>>
  (
    initialState: S,
    derivedStateResolver: (s: S) => D,
    actions: A
  ) => {
  let state = initialState;
  let derivedState = derivedStateResolver(initialState);
  const listeners: (() => void)[] = [];
  const get = () => state;
  const getWithDerived = () => ({ ...state, ...derivedState });
  const set = (newState: S) => {
    state = newState;
    derivedState = derivedStateResolver(newState);
    listeners.forEach((x) => x());
  };
  const actionsProxied = buildActionsProxied(actions, get, set);
  const subscribe = (func: () => void) => {
    listeners.push(func);
    return () => {
      listeners.splice(listeners.length - 1);
    };
  };

  type Selector = (ms: S & D) => Partial<S & D>;
  const useStore = (selector: Selector = (ms) => ms) => {
    const selectorMemoized = useCallback(selector, []);
    const lastState = useRef(selectorMemoized(getWithDerived()));
    const [state, setState] = useState(selectorMemoized(getWithDerived()));
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

    return [state, actionsProxied] as const;
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

