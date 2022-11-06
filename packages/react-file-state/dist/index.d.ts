import { JsonObject, JsonArray, JsonPrimitive } from 'type-fest';

declare type Data = JsonObject | JsonArray | JsonPrimitive;
declare type State = {
    [k: string]: Data;
};
declare type DerivedState = {
    [k: string]: Data;
};
declare type Actions = {
    [k: string]: (...args: any[]) => void;
};
declare const createStore: <S extends State, D extends DerivedState, A extends Actions>(initialState: S, derivedStateResolver: (s: S) => D, actionsCreator: (get: () => S, set: (newState: S) => void, set2: (stateMutator: (prevState: S) => S) => void) => A) => {
    get: () => S;
    getDerived: () => D;
    getWithDerived: () => S & D;
    set: (newState: S) => void;
    subscribe: (func: () => void) => () => void;
    actions: A;
    useStore: <U>(selector?: (ms: S & D) => U) => readonly [U, A];
};

declare const mutate: <A>(a: A, massager: (a: A) => void) => A;

declare const pick: <T, U extends keyof T>(object: T, keys: U[]) => Pick<T, U>;

export { createStore, mutate, pick };
