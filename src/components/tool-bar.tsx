"use client";

import {
  ArrowDownToLine,
  CaseSensitive,
  Columns3,
  FoldHorizontal,
  Pi,
  Table2,
  Text,
} from "lucide-react";
import localFont from "next/font/local";
import { useEffect } from "react";
import { toast } from "sonner";
import { symbols } from "~/lib/constants";
import { useDocumentStore } from "~/lib/store";
import { generateGrid } from "~/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export default function ToolBar() {
  const userInput = useDocumentStore((state) => state.userInput);
  const setUserInput = useDocumentStore((state) => state.setUserInput);

  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const columnCount = useDocumentStore((state) => state.config.columnCount);
  const rowCount = useDocumentStore((state) => state.config.rowCount);
  const columnGap = useDocumentStore((state) => state.config.columnGap);
  const rowGap = useDocumentStore((state) => state.config.rowGap);
  const offset = useDocumentStore((state) => state.config.offset);

  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

  const setDocument = useDocumentStore((state) => state.setDocument);
  function handleProcessInput() {
    generateGrid(userInput);
  }

  useEffect(() => {
    generateGrid(userInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowCount, columnCount]);

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-white py-2 print:hidden">
      <div className="mx-auto flex w-[210mm] items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Text className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="h-[300px] w-[400px]" align="start">
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="h-full w-full"
              placeholder="Enter Chinese text here"
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Columns3 className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <ToolbarSlider
              id="column-count"
              value={columnCount}
              min={1}
              max={30}
              label="Columns"
              onValueChange={(e) => setDocument({ columnCount: e })}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <CaseSensitive className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="flex flex-col gap-2">
              <ToolbarSlider
                id="main-text-size"
                value={mainTextSize}
                min={20}
                max={60}
                label="Main Text Size"
                onValueChange={(e) => setDocument({ mainTextSize: e })}
              />
              <ToolbarSlider
                id="secondary-text-size"
                value={secondaryTextSize}
                min={0}
                label="Pinyin Text Size"
                onValueChange={(e) => setDocument({ secondaryTextSize: e })}
              />
              <ToolbarSlider
                id="pinyin-offset"
                value={offset}
                min={-10}
                max={10}
                label="Pinyin Offset"
                onValueChange={(e) => setDocument({ offset: e })}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <FoldHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="flex flex-col gap-2">
              <ToolbarSlider
                id="row-gap"
                value={rowGap}
                min={0}
                max={40}
                label="Row Gap"
                onValueChange={(e) => setDocument({ rowGap: e })}
              />
              <ToolbarSlider
                id="column-gap"
                value={columnGap}
                min={0}
                max={40}
                label="Column Gap"
                onValueChange={(e) => setDocument({ columnGap: e })}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Table2 className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="flex flex-col gap-2">
              <ToolbarSlider
                id="margin-y"
                value={marginY}
                min={0}
                max={150}
                inc={10}
                label="Horizontal Margin"
                onValueChange={(e) => setDocument({ marginY: e })}
              />
              <ToolbarSlider
                id="margin-x"
                value={marginX}
                min={0}
                max={150}
                inc={10}
                label="Vertical Margin"
                onValueChange={(e) => setDocument({ marginX: e })}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pi className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <div className="grid grid-cols-4 justify-center gap-1">
              {symbols.map((symbol) => (
                <Button
                  variant="ghost"
                  size="reset"
                  key={symbol.value}
                  className={`size-4 ${symbol.needsFont && font.className}`}
                  onClick={async () => {
                    await navigator.clipboard.writeText(symbol.value);
                    toast.success("Copied to clipboard");
                  }}
                >
                  {symbol.value}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleProcessInput}
          size="reset"
          className="h-6 px-2 text-xs"
        >
          Generate
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.print()}
          className="ml-auto"
        >
          <ArrowDownToLine className="size-4" />
        </Button>
      </div>
    </div>
  );
}

interface ToolbarSliderProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  inc?: number;
  onValueChange: (value: number) => void;
}
function ToolbarSlider(props: ToolbarSliderProps) {
  const { id, label, value, onValueChange, min = 0, max = 40, inc = 1 } = props;
  return (
    <div className="grid w-[150px] gap-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs">
          {label}
        </Label>
        <span className="text-muted-foreground hover:border-border w-8 rounded-md border border-transparent px-1 py-0.5 text-right text-sm">
          {value}
        </span>
      </div>
      <Slider
        id="mainTextSize"
        max={max}
        min={min}
        defaultValue={[value]}
        step={inc}
        onValueChange={([e]) => onValueChange(e ?? value)}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="mainTextSize"
      />
    </div>
  );
}
