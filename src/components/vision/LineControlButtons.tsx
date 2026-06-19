import { Play, Square } from "lucide-react";

export function LineControlButtons({
  lineRunning,
  onToggleLine,
}: {
  lineRunning: boolean;
  onToggleLine: () => void;
}) {
  if (lineRunning) {
    return (
      <button
        onClick={onToggleLine}
        className="flex h-7 items-center gap-1.5 rounded-sm border border-destructive/50 bg-destructive/15 px-3 text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/25"
      >
        <Square className="h-2.5 w-2.5 fill-current" /> STOP
      </button>
    );
  }

  return (
    <button
      onClick={onToggleLine}
      className="flex h-7 items-center gap-1.5 rounded-sm border border-success/50 bg-success/15 px-3 text-[10px] font-bold uppercase tracking-wider text-success hover:bg-success/25"
    >
      <Play className="h-2.5 w-2.5 fill-current" /> START
    </button>
  );
}
