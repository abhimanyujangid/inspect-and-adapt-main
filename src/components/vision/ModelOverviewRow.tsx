import { Brain } from "lucide-react";
import type { Dataset, Model } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { Badge } from "./ui";

export function ModelOverviewRow({
  model,
  datasets,
}: {
  model: Model;
  datasets: Dataset[];
}) {
  const ds = datasets.find((d) => d.id === model.datasetId);
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-sm border bg-surface px-4 py-2.5",
        model.active ? "border-success/40" : "border-border",
      )}
    >
      <div className="flex items-center gap-3">
        <Brain className={cn("h-3.5 w-3.5", model.active ? "text-success" : "text-primary")} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-foreground">{model.name}</span>
            {model.active && <Badge tone="success">ACTIVE</Badge>}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Dataset: {ds?.name ?? "Unknown"} · Threshold: {model.threshold}
          </div>
        </div>
      </div>
      <Badge tone={model.active ? "success" : "default"}>{model.status}</Badge>
    </div>
  );
}
