import React from "react";

export const useToggle = (initialIsOpen = false) => {
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);
  return [isOpen, () => { setIsOpen(prev => !prev); }] as const;
};
