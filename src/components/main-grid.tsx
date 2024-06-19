"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  BoxSelect,
  CircleX,
  Ellipsis,
  PaintBucket,
  RotateCw,
} from "lucide-react";
import localFont from "next/font/local";
import { useDocumentStore, type CellState } from "~/lib/store";
import { pageSlices } from "~/lib/utils";
import { PrintablePage } from "./printable-page";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
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
                      <PopoverTrigger className="data-[state=open]:outline data-[state=open]:outline-red-500">
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
                            {content.get(`${row}:${j}`)?.pinyin2 ??
                              content.get(`${row}:${j}`)?.pinyin}
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
                      <PopoverContent align="start" side="right">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Input
                              value={
                                content.get(`${row}:${j}`)?.pinyin2 ??
                                content.get(`${row}:${j}`)?.pinyin ??
                                ""
                              }
                              onChange={(e) => {
                                const cell = content.get(`${row}:${j}`);
                                if (!cell) return;

                                setCell(`${row}:${j}`, {
                                  pinyin2: e.target.value,
                                });
                                setMod(cell.id, {
                                  ...cell,
                                  pinyin2: e.target.value,
                                });
                              }}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="reset"
                                  className="size-8 shrink-0"
                                >
                                  <Ellipsis className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="min-w-[2rem]"
                              >
                                <div className="flex flex-col gap-2">
                                  {content
                                    .get(`${row}:${j}`)
                                    ?.options?.map((option) => (
                                      <Button
                                        variant="ghost"
                                        size="reset"
                                        className="px-2 py-1"
                                        key={option}
                                        onClick={() => {
                                          const cell = content.get(
                                            `${row}:${j}`,
                                          );
                                          if (!cell) return;

                                          setCell(`${row}:${j}`, {
                                            pinyin2: option,
                                          });
                                          setMod(cell.id, {
                                            ...cell,
                                            pinyin2: option,
                                          });
                                        }}
                                      >
                                        {option}
                                      </Button>
                                    ))}
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="reset"
                                  className="size-8 shrink-0"
                                >
                                  <PaintBucket className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="min-w-[2rem]"
                              >
                                <div className="flex flex-col gap-2">
                                  {[
                                    "red",
                                    "yellow",
                                    "green",
                                    "blue",
                                    "purple",
                                    "pink",
                                    "aqua",
                                  ].map((color) => (
                                    <Button
                                      variant="ghost"
                                      size="reset"
                                      className="px-2 py-1"
                                      key={color}
                                      onClick={() => {
                                        const cell = content.get(`${row}:${j}`);
                                        if (!cell) return;

                                        setCell(`${row}:${j}`, {
                                          color,
                                        });
                                        setMod(cell.id, {
                                          ...cell,
                                          color,
                                        });
                                      }}
                                    >
                                      <div
                                        className="size-4 rounded-full"
                                        style={{ backgroundColor: color }}
                                      ></div>
                                    </Button>
                                  ))}
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="reset"
                              className="size-8"
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
                              variant="outline"
                              className="size-8"
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
                            <Button
                              variant="outline"
                              className="ml-auto size-8"
                              size="reset"
                              onClick={() => {
                                const cell = content.get(`${row}:${j}`);
                                if (!cell) return;
                                setCell(`${row}:${j}`, {
                                  value: cell.value,
                                  pinyin: cell.pinyin,
                                  pinyin2: undefined,
                                  color: undefined,
                                  rotate: undefined,
                                  border: undefined,
                                } as CellState);
                                setMod(cell.id, null);
                              }}
                            >
                              <CircleX className="size-4" />
                            </Button>
                          </div>
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
