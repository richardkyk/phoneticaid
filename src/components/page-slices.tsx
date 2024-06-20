"use client";

import React from "react";
import { useSliceSize } from "~/hooks/use-slice-size";
import { useDocumentStore } from "~/lib/store";

export const PageSliceSizeContext = React.createContext<number>(0);
export const PageSlicePageNumContext = React.createContext<number>(0);

interface PageSlicesProps {
  children: JSX.Element;
}
export function PageSlices(props: PageSlicesProps) {
  const { children } = props;

  const rowCount = useDocumentStore((state) => state.config.rowCount);

  const sliceSize = useSliceSize();

  const slices = Math.ceil(rowCount / sliceSize);

  return Array.from(Array(slices)).map((_, i) => (
    <PageSliceSizeContext.Provider value={sliceSize} key={i}>
      <PageSlicePageNumContext.Provider value={i}>
        {React.cloneElement(children, { pageNum: i, key: i })}
      </PageSlicePageNumContext.Provider>
    </PageSliceSizeContext.Provider>
  ));
}
