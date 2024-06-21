"use client";

import React from "react";
import { CellIdProvider } from "~/contexts/cell-id-context";
import {
  usePageSlicePageNum,
  usePageSliceSize,
} from "~/contexts/page-slice-context";
import { useDocumentStore } from "~/lib/store";

interface PageGridRowProps {
  children: React.ReactNode;
}
function PageGridRow(props: PageGridRowProps) {
  const { children } = props;

  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const align = useDocumentStore((state) => state.config.align);
  const textDirection = useDocumentStore((state) => state.config.textDirection);

  return (
    <div
      className="flex"
      style={{
        gap: `${rowGap}px`,
        justifyContent: align,
        flexDirection:
          textDirection === "ttb-lr"
            ? "row"
            : textDirection === "ttb-rl"
              ? "row-reverse"
              : "column",
      }}
    >
      {children}
    </div>
  );
}

interface PageGridColumnProps {
  children: React.ReactNode;
}
function PageGridColumn(props: PageGridColumnProps) {
  const { children } = props;

  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const align = useDocumentStore((state) => state.config.align);
  const textDirection = useDocumentStore((state) => state.config.textDirection);

  const textFlow =
    textDirection === "ltr" || textDirection === "rtl"
      ? "horizontal"
      : "vertical";

  return (
    <div
      className="flex"
      style={{
        gap: `${columnGap}px`,
        justifyContent: align,
        flexDirection:
          textFlow === "vertical"
            ? "column"
            : textDirection === "rtl"
              ? "row-reverse"
              : "row",
      }}
    >
      {children}
    </div>
  );
}

interface PageGridProps {
  children: JSX.Element;
}
export function PageGrid(props: PageGridProps) {
  const { children } = props;

  const pageNum = usePageSlicePageNum();
  const sliceSize = usePageSliceSize();

  const columnCount = useDocumentStore((state) => state.config.columnCount);

  const rows = Array.from(Array(sliceSize)).map(
    (_, i) => i + pageNum * sliceSize,
  );
  const cols = Array.from(Array(columnCount)).map((_, i) => i);

  return (
    <PageGridRow>
      {rows.map((row) => (
        <PageGridColumn key={row}>
          {cols.map((col) => (
            <CellIdProvider cellId={`${row}:${col}`} key={`${row}:${col}`}>
              {React.cloneElement(children, {
                id: `${row}:${col}`,
                key: `${row}:${col}`,
              })}
            </CellIdProvider>
          ))}
        </PageGridColumn>
      ))}
    </PageGridRow>
  );
}
