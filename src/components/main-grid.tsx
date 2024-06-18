"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import { BoxSelect, RotateCw } from "lucide-react";
import localFont from "next/font/local";
import { useDocumentStore, type CellState } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PrintablePage } from "./printable-page";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

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
  const zoom = useDocumentStore((state) => state.config.zoom);

  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

  const setCell = useDocumentStore((state) => state.setCell);
  const setMod = useDocumentStore((state) => state.setMod);

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
    <div
      id="main-grid"
      className="mx-auto flex w-max flex-col gap-8 after:h-px after:w-[calc(100%+2rem)] after:content-[''] print:gap-0 print:after:h-0"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "0 0",
      }}
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
                    <Popover key={`${row}:${j}`}>
                      <PopoverTrigger>
                        <div id={`${row}:${j}`} className="flex flex-col">
                          <div
                            className="flex w-full items-center justify-center font-sans"
                            style={{
                              fontSize: `${secondaryTextSize}px`,
                              height: `${secondaryTextSize}px`,
                              lineHeight: `${secondaryTextSize}px`,
                              marginBottom: `${offset}px`,
                            }}
                          >
                            {content.get(`${row}:${j}`)?.pinyin}
                          </div>
                          <div
                            className={`flex items-center justify-center ${font.className} border border-gray-100 hover:border-gray-500 print:border-transparent`}
                            style={{
                              fontSize: `${mainTextSize}px`,
                              lineHeight: `${mainTextSize}px`,
                              height: `${mainTextSize}px`,
                              width: `${mainTextSize}px`,
                              rotate: content.get(`${row}:${j}`)?.rotate
                                ? "90deg"
                                : undefined,
                              color: content.get(`${row}:${j}`)?.color,
                              borderLeft: content.get(`${row}:${j}`)?.border
                                ? "1px solid"
                                : undefined,
                            }}
                          >
                            {content.get(`${row}:${j}`)?.value}
                          </div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent align="start">
                        <div className="flex flex-col gap-2">
                          <Input
                            value={content.get(`${row}:${j}`)?.pinyin ?? ""}
                            onChange={(e) => {
                              const cell = content.get(`${row}:${j}`);
                              if (!cell) return;

                              setCell(`${row}:${j}`, {
                                pinyin: e.target.value,
                              });
                              setMod(cell.id, {
                                ...cell,
                                pinyin: e.target.value,
                              });
                            }}
                          />

                          <RadioGroup
                            className="flex justify-between gap-2 rounded-md border p-2"
                            value={content.get(`${row}:${j}`)?.color ?? ""}
                            onValueChange={(e) => {
                              const cell = content.get(`${row}:${j}`);
                              if (!cell) return;
                              setCell(`${row}:${j}`, { color: e });
                              setMod(cell.id, { ...cell, color: e });
                            }}
                          >
                            {[
                              "red",
                              "yellow",
                              "green",
                              "blue",
                              "purple",
                              "pink",
                              "aqua",
                            ].map((color) => (
                              <RadioGroupItem
                                key={color}
                                value={color}
                                style={{
                                  backgroundColor: color,
                                  border: "transparent",
                                  color: "white",
                                }}
                              />
                            ))}
                          </RadioGroup>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="reset"
                              className="p-1"
                              onClick={() => {
                                const cell = content.get(`${row}:${j}`);
                                if (!cell) return;

                                setCell(`${row}:${j}`, { rotate: true });
                                setMod(cell.id, { ...cell, rotate: true });
                              }}
                            >
                              <RotateCw className="size-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              className="p-1"
                              size="reset"
                              onClick={() => {
                                const cell = content.get(`${row}:${j}`);
                                if (!cell) return;

                                setCell(`${row}:${j}`, { border: true });
                                setMod(cell.id, { ...cell, border: true });
                              }}
                            >
                              <BoxSelect className="size-4" />
                            </Button>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => {
                              const cell = content.get(`${row}:${j}`);
                              if (!cell) return;
                              setCell(`${row}:${j}`, {
                                value: cell.value,
                                pinyin: cell.pinyin,
                                color: undefined,
                                rotate: undefined,
                                border: undefined,
                              } as CellState);
                              setMod(cell.id, null);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
              </div>
            ))}
          </div>
        </PrintablePage>
      ))}
    </div>
  );
}
