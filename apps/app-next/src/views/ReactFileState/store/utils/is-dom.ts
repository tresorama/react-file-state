const isDOM = Boolean(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement
);

export const isServer = !isDOM;
export const isBrowser = isDOM;
