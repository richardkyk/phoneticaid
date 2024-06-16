"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import { PaintBucket, RotateCw } from "lucide-react";
import localFont from "next/font/local";
import { useDocumentStore, type CellState } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PrintablePage } from "./printable-page";
import { Button } from "./ui/button";
import { Popover, PopoverContent } from "./ui/popover";

// Font files can be colocated inside of `pages`
const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export function MainGrid() {
  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);

  const align = useDocumentStore((state) => state.config.align);
  const layout = useDocumentStore((state) => state.config.layout);
  const textDirection = useDocumentStore((state) => state.config.textDirection);

  const content = useDocumentStore((state) => state.content);
  const pageHeight = useDocumentStore((state) => state.config.pageHeight);
  const pageWidth = useDocumentStore((state) => state.config.pageWidth);

  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

  const setCell = useDocumentStore((state) => state.setCell);

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

  return (
    <div
      className="mx-auto flex flex-col items-center gap-8 print:gap-0"
      style={{ width: layout === "portrait" ? "210mm" : "297mm" }}
    >
      {pageSlices(overflowDimension).map((page, i) => (
        <PrintablePage
          key={i}
          pageNum={i}
          marginX={marginX}
          marginY={marginY}
          layout={layout}
        >
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
            {page.map((row) => (
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
                    <div id={`${row}:${j}`} key={j} className="flex flex-col">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="flex w-full items-center justify-center border border-gray-100 border-b-transparent font-sans  hover:border-gray-500 hover:border-b-gray-500 print:border-transparent"
                        style={{
                          fontSize: `${secondaryTextSize}px`,
                          height: `${secondaryTextSize}px`,
                          lineHeight: `${secondaryTextSize}px`,
                          marginBottom: `${offset}px`,
                          borderWidth: secondaryTextSize <= 1 ? 0 : undefined,
                        }}
                      >
                        {content.get(`${row}:${j}`)?.pinyin}
                      </div>

                      <Popover>
                        <PopoverTrigger>
                          <div
                            className={`flex items-center justify-center border border-gray-100 border-t-transparent print:border-transparent ${font.className}`}
                            style={{
                              fontSize: `${mainTextSize}px`,
                              lineHeight: `${mainTextSize}px`,
                              height: `${mainTextSize}px`,
                              width: `${mainTextSize}px`,
                              rotate: content.get(`${row}:${j}`)?.rotate
                                ? "90deg"
                                : undefined,
                              color: content.get(`${row}:${j}`)?.color,
                            }}
                          >
                            {content.get(`${row}:${j}`)?.value}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setCell(`${row}:${j}`, { rotate: true });
                              }}
                            >
                              <RotateCw className="size-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setCell(`${row}:${j}`, { color: "#ff0000" });
                              }}
                            >
                              <PaintBucket className="size-4" />
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const cell = content.get(`${row}:${j}`);
                                setCell(`${row}:${j}`, {
                                  value: cell?.value ?? "",
                                  pinyin: cell?.pinyin ?? "",
                                  color: undefined,
                                  rotate: undefined,
                                } as CellState);
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </PrintablePage>
      ))}
    </div>
  );
}
