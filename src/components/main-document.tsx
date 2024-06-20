"use client";

import { useDocumentStore } from "~/lib/store";
import { PageGrid } from "./page-grid";
import { PageSlices } from "./page-slices";
import { PrintablePage } from "./printable-page";
import { ScaledDocument } from "./scaled-document";

export function MainDocument() {
  console.log("main document");

  if (!useDocumentStore.persist.hasHydrated) return null;

  return (
    <ScaledDocument>
      <PageSlices>
        <PrintablePage>
          <PageGrid />
        </PrintablePage>
      </PageSlices>
    </ScaledDocument>
  );
}
