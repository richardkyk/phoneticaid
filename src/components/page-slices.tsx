"use client";

import React from "react";
import { PageSliceProvider } from "~/contexts/page-slice-context";
import { useSliceSize } from "~/hooks/use-slice-size";
import { useDocumentStore } from "~/lib/store";

interface PageSlicesProps {
  children: JSX.Element;
}
export function PageSlices(props: PageSlicesProps) {
  const { children } = props;

  const rowCount = useDocumentStore((state) => state.config.rowCount);

  const sliceSize = useSliceSize();

  const slices = Math.ceil(rowCount / sliceSize);

  return Array.from(Array(slices)).map((_, i) => (
    <PageSliceProvider pageNum={i} sliceSize={sliceSize} key={i}>
      {React.cloneElement(children, { pageNum: i, key: i })}
    </PageSliceProvider>
  ));
}
