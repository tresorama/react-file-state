import { JsonObject, JsonArray, JsonPrimitive } from 'type-fest';

declare type GetParameters<F> = F extends (...args: any) => any ? Parameters<F> : never;
declare type RemoveFirstArrayItem<T extends any[]> = ((...p: T) => void) extends ((p1: infer P1, ...rest: infer R) => void) ? R : never;
declare type Data = JsonObject | JsonArray | JsonPrimitive;
declare type State = {
    [k: string]: Data;
};
declare type DerivedState = {
    [k: string]: Data;
};
declare type Actions<S> = {
    [k: string]: (prevState: S, ...args: any[]) => S;
};
declare type ActionsProxied<A extends Actions<any>> = Record<keyof A, (...args: RemoveFirstArrayItem<GetParameters<A[keyof A]>>) => void>;
declare const createStore: <S extends State, D extends DerivedState, A extends Actions<S>>(initialState: S, derivedStateResolver: (s: S) => D, actions: A) => {
    get: () => S;
    set: (newState: S) => void;
    subscribe: (func: () => void) => () => void;
    actions: A;
    actionsProxied: ActionsProxied<A>;
    useStore: (selector?: (ms: S & D) => Partial<S & D>) => readonly [Partial<S & D>, ActionsProxied<A>];
};

export { createStore };
