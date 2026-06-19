import type { CameraConfiguration } from "@/lib/vision-storage";

export function CameraLivePreviewPanel({ draft }: { draft: CameraConfiguration }) {
  return (
    <div className="shrink-0 p-5 pb-0 xl:w-[58%] xl:pb-5">
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <div className="flex items-center justify-between bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            Live Inspection
          </div>
          <span className="font-mono-tabular">{draft.fps} FPS</span>
        </div>
        <div className="aspect-[4/3] bg-[#e8eaee] grid-bg" />
      </div>
    </div>
  );
}
