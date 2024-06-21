"use client";

import React, { createContext, useContext } from "react";

const CellIdContext = createContext<string>("");

export const useCellId = () => useContext(CellIdContext);

interface CellIdProviderProps {
  children: React.ReactNode;
  cellId: string;
}
export const CellIdProvider = (props: CellIdProviderProps) => {
  const { children, cellId } = props;

  return (
    <CellIdContext.Provider value={cellId}>{children}</CellIdContext.Provider>
  );
};
