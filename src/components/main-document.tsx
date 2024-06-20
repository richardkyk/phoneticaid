"use client";

import { useDocumentStore } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PageGrid } from "./page-grid";
import { PrintablePage } from "./printable-page";
import { ScaledDocument } from "./scaled-document";

export function MainDocument() {
  console.log("main document");

  const pageHeight = useDocumentStore((state) => state.config.pageHeight);
  const pageWidth = useDocumentStore((state) => state.config.pageWidth);
  const textDirection = useDocumentStore((state) => state.config.textDirection);
  const layout = useDocumentStore((state) => state.config.layout);

  const textFlow =
    textDirection === "ltr" || textDirection === "rtl"
      ? "horizontal"
      : "vertical";

  const overflowDimension =
    textFlow === "horizontal"
      ? layout === "portrait"
        ? pageHeight
        : pageWidth
      : layout === "portrait"
        ? pageWidth
        : pageHeight;

  if (!useDocumentStore.persist.hasHydrated) return null;

  return (
    <ScaledDocument>
      {pageSlices(overflowDimension).map((rows, i) => (
        <PrintablePage key={i} pageNum={i}>
          <PageGrid rows={rows} />
        </PrintablePage>
      ))}
    </ScaledDocument>
  );
}
