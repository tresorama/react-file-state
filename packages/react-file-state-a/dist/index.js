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
  createStore: () => createStore
});
module.exports = __toCommonJS(src_exports);

// src/create-store.ts
var import_react = require("react");
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
    const selectorMemoized = (0, import_react.useCallback)(selector, []);
    const lastState = (0, import_react.useRef)(selectorMemoized(getWithDerived()));
    const [state2, setState] = (0, import_react.useState)(selectorMemoized(getWithDerived()));
    (0, import_react.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createStore
});
//# sourceMappingURL=index.js.map