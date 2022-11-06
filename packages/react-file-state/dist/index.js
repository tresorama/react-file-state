"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createStore: () => createStore,
  mutate: () => mutate,
  pick: () => pick
});
module.exports = __toCommonJS(src_exports);

// src/create-store.ts
var import_react = require("react");

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
  const getDerived = () => derivedState;
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
    const selectorMemoized = (0, import_react.useCallback)(selector, []);
    const lastState = (0, import_react.useRef)(selectorMemoized(getWithDerived()));
    const [state2, setState] = (0, import_react.useState)(selectorMemoized(getWithDerived()));
    (0, import_react.useEffect)(() => {
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
    getDerived,
    getWithDerived,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createStore,
  mutate,
  pick
});
//# sourceMappingURL=index.js.map