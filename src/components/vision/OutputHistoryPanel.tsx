import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HISTORY_IMAGE_COUNT, HISTORY_IMAGES } from "@/lib/vision-mock-data";
function NavBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-sm border border-border bg-card px-2 text-[9px] font-bold uppercase tracking-wider",
        disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-foreground hover:bg-surface",
      )}
    >
      {children}
      {label}
    </button>
  );
}

export function OutputHistoryPanel() {
  const [index, setIndex] = useState(0);
  const image = HISTORY_IMAGES[index];
  const atStart = index === 0;
  const atEnd = index === HISTORY_IMAGE_COUNT - 1;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          Image Buffer
        </span>
        <div className="flex items-center gap-3 font-mono-tabular text-[10px]">
          <span className="text-muted-foreground">{image.time}</span>
          <span className={cn("font-bold uppercase", image.pass ? "text-success" : "text-destructive")}>
            {image.pass ? "Pass" : "Fail"}
          </span>
          <span className="text-muted-foreground">Score {image.score}</span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <div className="font-mono-tabular text-5xl font-bold text-muted-foreground/40">
            {image.index}
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Marked Output
          </div>
          <div className="mt-1 text-[10px] text-muted-foreground">No image loaded</div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <NavBtn label="First" disabled={atStart} onClick={() => setIndex(0)}>
              <ChevronsLeft className="h-3 w-3" />
            </NavBtn>
            <NavBtn label="Prev" disabled={atStart} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              <ChevronLeft className="h-3 w-3" />
            </NavBtn>
          </div>
          <div className="text-center">
            <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
              Position
            </div>
            <div className="font-mono-tabular text-sm font-bold text-foreground">
              {String(index + 1).padStart(2, "0")} / {HISTORY_IMAGE_COUNT}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <NavBtn
              label="Next"
              disabled={atEnd}
              onClick={() => setIndex((i) => Math.min(HISTORY_IMAGE_COUNT - 1, i + 1))}
            >
              <ChevronRight className="h-3 w-3" />
            </NavBtn>
            <NavBtn label="Last" disabled={atEnd} onClick={() => setIndex(HISTORY_IMAGE_COUNT - 1)}>
              <ChevronsRight className="h-3 w-3" />
            </NavBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
