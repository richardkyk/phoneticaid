import { useDocumentStore } from "~/lib/store";
import { CellPopover } from "./cell-popover";

interface PageGridProps {
  pageNum: number;
}
export function PageGrid(props: PageGridProps) {
  const { pageNum } = props;

  const sliceSize = useDocumentStore((state) => state.config.sliceSize);
  const rows = Array.from(Array(sliceSize).keys()).map(
    (i) => sliceSize * pageNum + i,
  );

  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);

  const align = useDocumentStore((state) => state.config.align);
  const textDirection = useDocumentStore((state) => state.config.textDirection);

  const columnCount = useDocumentStore((state) => state.config.columnCount);

  console.log("page grid");

  const textFlow =
    textDirection === "ltr" || textDirection === "rtl"
      ? "horizontal"
      : "vertical";

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
      {rows.map((row) => (
        <div
          key={row}
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
          {Array(columnCount)
            .fill(0)
            .map((_, j) => (
              <CellPopover id={`${row}:${j}`} key={`${row}:${j}`} />
            ))}
        </div>
      ))}
    </div>
  );
}
