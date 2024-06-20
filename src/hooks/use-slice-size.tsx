import { useMemo } from "react";
import { useDocumentStore } from "~/lib/store";

export function useSliceSize() {
  const pageHeight = useDocumentStore((state) => state.config.pageHeight);
  const pageWidth = useDocumentStore((state) => state.config.pageWidth);
  const textDirection = useDocumentStore((state) => state.config.textDirection);
  const layout = useDocumentStore((state) => state.config.layout);

  const textFlow =
    textDirection === "ltr" || textDirection === "rtl"
      ? "horizontal"
      : "vertical";

  const availableSpace =
    textFlow === "horizontal"
      ? layout === "portrait"
        ? pageHeight
        : pageWidth
      : layout === "portrait"
        ? pageWidth
        : pageHeight;

  const mainFontSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryFontSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);
  const marginY = useDocumentStore((state) => state.config.marginY);
  const marginX = useDocumentStore((state) => state.config.marginX);

  const sliceSize = useMemo(() => {
    let sliceSize = 0;
    const borderWidth = 1.6;
    if (textDirection === "ltr" || textDirection === "rtl") {
      // for ltr and rtl
      const rowHeight = mainFontSize + secondaryFontSize + rowGap + offset;
      const useableSpace = availableSpace - marginY * 2 + rowGap - borderWidth; // add the last rowGap since the last row doesn't need to space underneath it
      sliceSize = Math.floor(useableSpace / rowHeight);
    } else {
      // for ttb-lr and ttb-rl
      const columnGap = rowGap; // this is swapped since we we have changed the flex directions
      const columnWidth = mainFontSize + columnGap;
      const useableSpace =
        availableSpace - marginX * 2 + columnGap - borderWidth; // add the last rowGap since the last row doesn't need to space underneath it
      sliceSize = Math.floor(useableSpace / columnWidth);
    }
    return sliceSize < 1 ? 1 : sliceSize;
  }, [
    availableSpace,
    mainFontSize,
    secondaryFontSize,
    rowGap,
    offset,
    marginY,
    marginX,
    textDirection,
  ]);

  return sliceSize;
}
