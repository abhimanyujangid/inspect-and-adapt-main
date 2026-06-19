import { Images } from "lucide-react";
import type { Dataset } from "@/lib/vision-storage";

export function DatasetOverviewRow({ ds }: { ds: Dataset }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-border bg-surface px-4 py-2.5">
      <div className="flex items-center gap-3">
        <Images className="h-3.5 w-3.5 text-primary" />
        <div>
          <div className="text-[11px] font-bold text-foreground">{ds.name}</div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            {ds.images.length} image{ds.images.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      {ds.images.length > 0 && (
        <div className="flex gap-1">
          {ds.images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="h-7 w-7 overflow-hidden rounded-sm border border-border bg-[#e8eaee]"
            >
              <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
            </div>
          ))}
          {ds.images.length > 4 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-surface-2 text-[8px] font-bold text-muted-foreground">
              +{ds.images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
