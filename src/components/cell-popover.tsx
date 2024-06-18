import { PopoverTrigger } from "@radix-ui/react-popover";
import { BoxSelect, RotateCw } from "lucide-react";
import localFont from "next/font/local";
import { useDocumentStore, type CellState } from "~/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Popover, PopoverContent } from "./ui/popover";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const font = localFont({ src: "../fonts/KaiTi2.ttf" });

interface CellPopoverProps {
  id: string;
}
export function CellPopover(props: CellPopoverProps) {
  const { id } = props;

  const mainTextSize = useDocumentStore((state) => state.config.mainTextSize);
  const secondaryTextSize = useDocumentStore(
    (state) => state.config.secondaryTextSize,
  );
  const offset = useDocumentStore((state) => state.config.offset);

  const content = useDocumentStore((state) => state.content);
  const setCell = useDocumentStore((state) => state.setCell);
  const setMod = useDocumentStore((state) => state.setMod);

  return (
    <Popover key={id}>
      <PopoverTrigger>
        <div
          id={id}
          className="flex flex-col border border-gray-100 hover:border-gray-500 print:border-transparent"
          style={{
            borderLeft: content.get(id)?.border ? "1px solid" : undefined,
          }}
        >
          <div
            className="flex w-full items-center justify-center font-sans"
            style={{
              fontSize: `${secondaryTextSize}px`,
              height: `${secondaryTextSize}px`,
              lineHeight: `${secondaryTextSize}px`,
              marginBottom: `${offset}px`,
            }}
          >
            {content.get(id)?.pinyin}
          </div>
          <div
            className={`flex items-center justify-center ${font.className}`}
            style={{
              fontSize: `${mainTextSize}px`,
              lineHeight: `${mainTextSize}px`,
              height: `${mainTextSize}px`,
              width: `${mainTextSize}px`,
              rotate: content.get(id)?.rotate ? "90deg" : undefined,
              color: content.get(id)?.color,
            }}
          >
            {content.get(id)?.value}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" side="right">
        <div className="flex flex-col gap-2">
          <Input
            value={content.get(id)?.pinyin ?? ""}
            onChange={(e) => {
              const cell = content.get(id);
              if (!cell) return;

              setCell(id, {
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
            value={content.get(id)?.color ?? ""}
            onValueChange={(e) => {
              const cell = content.get(id);
              if (!cell) return;
              setCell(id, { color: e });
              setMod(cell.id, { ...cell, color: e });
            }}
          >
            {["red", "yellow", "green", "blue", "purple", "pink", "aqua"].map(
              (color) => (
                <RadioGroupItem
                  key={color}
                  value={color}
                  style={{
                    backgroundColor: color,
                    border: "transparent",
                    color: "white",
                  }}
                />
              ),
            )}
          </RadioGroup>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="reset"
              className="p-1"
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
              variant="secondary"
              className="p-1"
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
          </div>

          <Button
            variant="outline"
            onClick={() => {
              const cell = content.get(id);
              if (!cell) return;
              setCell(id, {
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
  );
}
