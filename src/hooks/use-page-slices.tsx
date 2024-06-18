import { useEffect, useState } from "react";
import { useDocumentStore } from "~/lib/store";
import { pageSlices } from "~/lib/utils";

export function usePageSlices() {
  const [pages, setPages] = useState<number>(0);
  const layout = useDocumentStore((state) => state.config.layout);
  const textFlow = useDocumentStore((state) => state.config.textFlow);

  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const pageHeight = useDocumentStore((state) => state.config.pageHeight);
  const pageWidth = useDocumentStore((state) => state.config.pageWidth);

  const overflowDimension =
    textFlow === "horizontal"
      ? layout === "portrait"
        ? pageHeight
        : pageWidth
      : layout === "portrait"
        ? pageWidth
        : pageHeight;

  useEffect(() => {
    const slices = pageSlices(overflowDimension);
    setPages(slices.length);
    console.log("slices", slices);
  }, [overflowDimension, columnCount]);

  return pages;
}
