import localFont from "next/font/local";
import { useEffect, useRef } from "react";
import { symbols } from "~/lib/constants";
import { useDocumentStore } from "~/lib/store";
import { generateGrid } from "~/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export default function ToolBar() {
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    generateGrid(inputRef.current?.value ?? "");
  }

  useEffect(() => {
    generateGrid(inputRef.current?.value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowCount, columnCount]);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Textarea
          ref={inputRef}
          className="h-full"
          placeholder="Enter Chinese text here"
          defaultValue="獻供開始兩邊排班對面作揖各就拜位"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div
            className={`inline-grid flex-shrink-0 grid-cols-3 items-center gap-1 ${font.className}`}
          >
            {symbols.map((symbol) => (
              <Button
                variant="ghost"
                size="reset"
                key={symbol}
                className="h-4 p-1"
                onClick={async () => {
                  await navigator.clipboard.writeText(symbol);
                }}
              >
                {symbol}
              </Button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <ToolbarSlider
              id="main-text-size"
              value={mainTextSize}
              min={20}
              label="Main Text Size"
              onValueChange={(e) => setDocument({ mainTextSize: e })}
            />
            <ToolbarSlider
              id="secondary-text-size"
              value={secondaryTextSize}
              min={10}
              label="Secondary Text Size"
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
            <ToolbarSlider
              id="column-count"
              value={columnCount}
              min={1}
              max={30}
              label="Columns"
              onValueChange={(e) => setDocument({ columnCount: e })}
            />
            <ToolbarSlider
              id="column-gap"
              value={columnGap}
              max={30}
              label="Column Gap"
              onValueChange={(e) => setDocument({ columnGap: e })}
            />
            <ToolbarSlider
              id="row-gap"
              value={rowGap}
              min={0}
              max={30}
              label="Row Gap"
              onValueChange={(e) => setDocument({ rowGap: e })}
            />
            <ToolbarSlider
              id="margin-x"
              value={marginX}
              min={0}
              max={150}
              inc={10}
              label="Margin X"
              onValueChange={(e) => setDocument({ marginX: e })}
            />
            <ToolbarSlider
              id="margin-y"
              value={marginY}
              min={0}
              max={150}
              inc={10}
              label="Margin Y"
              onValueChange={(e) => setDocument({ marginY: e })}
            />
          </div>
        </div>
        <Button className="w-full" onClick={handleProcessInput}>
          Generate
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          Download
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
