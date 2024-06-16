"use client";

import { SelectTrigger } from "@radix-ui/react-select";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Ampersand,
  ArrowBigDownDash,
  ArrowBigLeftDash,
  ArrowBigRightDash,
  ArrowDownToLine,
  Baseline,
  BetweenHorizonalStart,
  Columns3,
  Languages,
  Proportions,
  Rows3,
  TextCursor,
  UnfoldHorizontal,
  ZoomIn,
} from "lucide-react";
import localFont from "next/font/local";
import React, { useRef } from "react";
import { punctuation, specialCharacters } from "~/lib/constants";
import { useDocumentStore } from "~/lib/store";
import { generateGrid } from "~/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";

const font = localFont({ src: "../fonts/KaiTi2.ttf" });

export default function ToolBar() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userInput = useDocumentStore((state) => state.userInput);
  const setUserInput = useDocumentStore((state) => state.setUserInput);

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
  const zoom = useDocumentStore((state) => state.config.zoom);

  const textFlow =
    textDirection === "ltr" || textDirection === "rtl"
      ? "horizontal"
      : "vertical";

  const marginX = useDocumentStore((state) => state.config.marginX);
  const marginY = useDocumentStore((state) => state.config.marginY);

  const setDocument = useDocumentStore((state) => state.setDocument);
  async function handleProcessInput() {
    await generateGrid(userInput);
  }

  return (
    <div className="fixed inset-x-0 top-0 z-10 h-[42px] w-full border-b bg-white py-2 print:hidden">
      <div className="mx-auto flex max-w-[210mm] items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <TextCursor className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="h-[300px] w-[400px]" align="start">
            <div className="flex h-full w-full flex-col gap-2">
              <Textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onBlur={(e) => e.target.focus()}
                className={`flex-1 ${font.className}`}
                placeholder="Enter Chinese text here"
              />

              <div className="flex gap-2">
                <CharacterPopover
                  textareaRef={textareaRef}
                  symbols={punctuation}
                >
                  <Ampersand className="size-4" />
                </CharacterPopover>
                <CharacterPopover
                  textareaRef={textareaRef}
                  symbols={specialCharacters}
                >
                  <Languages className="size-4" />
                </CharacterPopover>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" className="h-4" />
        <Select
          value={layout}
          onValueChange={(e) =>
            setDocument({
              layout: e as "portrait" | "landscape",
            })
          }
        >
          <SelectTrigger asChild>
            <Button variant="ghost" size="icon">
              <Proportions className="size-4" />
            </Button>
          </SelectTrigger>
          <SelectContent align="start">
            <div className="flex flex-col text-xs">
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </div>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <UnfoldHorizontal className="size-4" />
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
              <ZoomIn className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <ToolbarSlider
              id="zoom"
              value={zoom}
              min={0}
              max={2}
              inc={0.1}
              label="Zoom"
              onValueChange={(e) => setDocument({ zoom: e })}
            />
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" className="h-4" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              {textFlow === "horizontal" ? (
                <Columns3 className="size-4" />
              ) : (
                <Rows3 className="size-4" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start">
            <ToolbarSlider
              id="column-count"
              value={columnCount}
              min={1}
              max={30}
              label={textFlow === "horizontal" ? "Column Count" : "Row Count"}
              onValueChange={(e) => setDocument({ columnCount: e })}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <BetweenHorizonalStart className="size-4" />
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
                onValueChange={(e) =>
                  setDocument({
                    ...(textFlow === "horizontal" && { rowGap: e }),
                    ...(textFlow === "vertical" && { columnGap: e }),
                  })
                }
              />
              <ToolbarSlider
                id="column-gap"
                value={columnGap}
                min={0}
                max={40}
                label="Column Gap"
                onValueChange={(e) =>
                  setDocument({
                    ...(textFlow === "horizontal" && { columnGap: e }),
                    ...(textFlow === "vertical" && { rowGap: e }),
                  })
                }
              />
            </div>
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" className="h-4" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Baseline className="size-4" />
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
        <Select
          value={textDirection}
          onValueChange={(e) =>
            setDocument({
              textDirection: e as "ltr" | "rtl" | "ttb-lr" | "ttb-rl",
            })
          }
        >
          <SelectTrigger asChild>
            <Button variant="ghost" size="icon">
              {textDirection === "ltr" && (
                <ArrowBigRightDash className="size-4" />
              )}
              {textDirection === "rtl" && (
                <ArrowBigLeftDash className="size-4" />
              )}
              {textDirection === "ttb-lr" && (
                <ArrowBigDownDash className="size-4" />
              )}
              {textDirection === "ttb-rl" && (
                <ArrowBigDownDash className="size-4" />
              )}
            </Button>
          </SelectTrigger>
          <SelectContent align="start">
            <div className="flex flex-col text-xs">
              <SelectItem value="ltr">Left to Right</SelectItem>
              <SelectItem value="rtl">Right to Left</SelectItem>
              <SelectItem value="ttb-lr">
                Top to Bottom, Left to Right
              </SelectItem>
              <SelectItem value="ttb-rl">
                Top to Bottom, Right to Left
              </SelectItem>
            </div>
          </SelectContent>
        </Select>
        <Select
          value={align}
          onValueChange={(e) =>
            setDocument({
              align: e as "start" | "center" | "end" | "space-between",
            })
          }
        >
          <SelectTrigger asChild>
            <Button variant="ghost" size="icon">
              {align === "start" && <AlignLeft className="size-4" />}
              {align === "center" && <AlignCenter className="size-4" />}
              {align === "end" && <AlignRight className="size-4" />}
              {align === "space-between" && <AlignJustify className="size-4" />}
            </Button>
          </SelectTrigger>
          <SelectContent align="start">
            <div className="flex flex-col text-xs">
              <SelectItem value="start">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="end">Right</SelectItem>
              <SelectItem value="space-between">Justify</SelectItem>
            </div>
          </SelectContent>
        </Select>

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
        <span className="w-8 rounded-md border border-transparent px-1 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
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

interface CharacterPopoverProps {
  children: React.ReactNode;
  symbols: string[];
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}
function CharacterPopover(props: CharacterPopoverProps) {
  const { children, symbols, textareaRef } = props;

  const userInput = useDocumentStore.getState().userInput;
  const setUserInput = useDocumentStore.getState().setUserInput;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="grid grid-cols-4 justify-center gap-2">
          {symbols.map((symbol) => (
            <Button
              variant="ghost"
              size="reset"
              key={symbol}
              className={`size-4 ${font.className}`}
              onClick={async () => {
                if (!textareaRef.current) return;
                const start = textareaRef.current.selectionStart;
                const end = start + 1;

                const nextValue =
                  userInput.slice(0, start) + symbol + userInput.slice(start);
                setUserInput(nextValue);
                textareaRef.current.value = nextValue;
                textareaRef.current.selectionStart = end;
                textareaRef.current.selectionEnd = end;

                await navigator.clipboard.writeText(symbol);
              }}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
