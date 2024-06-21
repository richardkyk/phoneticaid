"use client";

import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  BoxSelect,
  CircleX,
  Ellipsis,
  PaintBucket,
  RotateCw,
} from "lucide-react";
import { useCellId } from "~/contexts/cell-id-context";
import { useDocumentStore, type CellState } from "~/lib/store";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Popover, PopoverContent } from "./ui/popover";

interface CellPopoverProps {
  children: React.ReactNode;
}
export function CellPopover(props: CellPopoverProps) {
  const { children } = props;

  const id = useCellId();

  console.log("cell popover");

  const content = useDocumentStore((state) => state.content);
  const setCell = useDocumentStore((state) => state.setCell);
  const setMod = useDocumentStore((state) => state.setMod);

  return (
    <Popover>
      <PopoverTrigger className="data-[state=open]:outline data-[state=open]:outline-red-500">
        {children}
      </PopoverTrigger>
      <PopoverContent align="start" side="right">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              value={content.get(id)?.pinyin2 ?? content.get(id)?.pinyin ?? ""}
              onChange={(e) => {
                const cell = content.get(id);
                if (!cell) return;

                setCell(id, {
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
              <DropdownMenuContent align="start" className="min-w-[2rem]">
                <div className="flex flex-col gap-2">
                  {content.get(id)?.options?.map((option) => (
                    <Button
                      variant="ghost"
                      size="reset"
                      className="px-2 py-1"
                      key={option}
                      onClick={() => {
                        const cell = content.get(id);
                        if (!cell) return;

                        setCell(id, {
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
              <DropdownMenuContent align="start" className="min-w-[2rem]">
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
                        const cell = content.get(id);
                        if (!cell) return;

                        setCell(id, {
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
                const cell = content.get(id);
                if (!cell) return;

                setCell(id, { rotate: true });
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
                const cell = content.get(id);
                if (!cell) return;

                setCell(id, { border: true });
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
                const cell = content.get(id);
                if (!cell) return;
                setCell(id, {
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
  );
}

export function CellContent() {
  const id = useCellId();

  console.log("cell content");
  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const offset = useDocumentStore((state) => state.config.offset);

  const content = useDocumentStore((state) => state.content);

  return (
    <div className="flex flex-col">
      <div
        className="flex w-full items-center justify-center font-sans"
        style={{
          fontSize: `${secondaryTextSize}px`,
          height: `${secondaryTextSize}px`,
          lineHeight: `${secondaryTextSize}px`,
          marginBottom: `${offset}px`,
        }}
      >
        {content.get(id)?.pinyin2 ?? content.get(id)?.pinyin}
      </div>
      <div
        className={`font-cn flex items-center justify-center border border-gray-100 hover:border-gray-500 print:border-transparent`}
        style={{
          fontSize: `${mainTextSize}px`,
          lineHeight: `${mainTextSize}px`,
          height: `${mainTextSize}px`,
          width: `${mainTextSize}px`,
          rotate: content.get(id)?.rotate ? "90deg" : undefined,
          color: content.get(id)?.color,
          borderLeft: content.get(id)?.border ? "1px solid" : undefined,
        }}
      >
        {content.get(id)?.value}
      </div>
    </div>
  );
}
