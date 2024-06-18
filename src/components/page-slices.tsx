import { useEffect } from "react";
import { useDocumentStore } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PrintablePage } from "./printable-page";

interface PageSlicesProps {
  children: (rows: number[]) => React.ReactNode;
}
export function usePageSlices(props: PageSlicesProps) {
  const { children } = props;
  const layout = useDocumentStore((state) => state.config.layout);
  const textFlow = useDocumentStore((state) => state.config.textFlow);

  const pageHeight = useDocumentStore((state) => state.config.pageHeight);
  const pageWidth = useDocumentStore((state) => state.config.pageWidth);

  console.log("page slices", pageHeight, pageWidth);

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
    console.log("slices", slices);
  }, [overflowDimension]);

  return null;

  return pageSlices(overflowDimension).map((rows, i) => (
    <PrintablePage key={i} pageNum={i}>
      {children(rows)}
    </PrintablePage>
  ));
}
