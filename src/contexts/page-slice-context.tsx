"use client";

import React, { createContext, useContext } from "react";

const PageSliceSizeContext = createContext<number>(0);
const PageSlicePageNumContext = createContext<number>(0);

export const usePageSliceSize = () => useContext(PageSliceSizeContext);
export const usePageSlicePageNum = () => useContext(PageSlicePageNumContext);

interface PageSliceProviderProps {
  children: React.ReactNode;
  pageNum: number;
  sliceSize: number;
}
export const PageSliceProvider = (props: PageSliceProviderProps) => {
  const { children, pageNum, sliceSize } = props;

  return (
    <PageSliceSizeContext.Provider value={sliceSize} key={pageNum}>
      <PageSlicePageNumContext.Provider value={pageNum}>
        {children}
      </PageSlicePageNumContext.Provider>
    </PageSliceSizeContext.Provider>
  );
};
