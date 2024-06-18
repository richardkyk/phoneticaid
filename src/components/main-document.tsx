"use client";

import { usePageSlices } from "~/hooks/use-page-slices";
import { useDocumentStore } from "~/lib/store";
import { PageGrid } from "./page-grid";
import { PrintablePage } from "./printable-page";
import { ScaledDocument } from "./scaled-document";

export function MainDocument() {
  console.log("main document");
  const pages = usePageSlices();

  if (!useDocumentStore.persist.hasHydrated) return null;

  return (
    <ScaledDocument>
      {Array.from(Array(pages).keys()).map((page, i) => (
        <PrintablePage key={i} pageNum={page}>
          <PageGrid pageNum={page} />
        </PrintablePage>
      ))}
    </ScaledDocument>
  );
}
