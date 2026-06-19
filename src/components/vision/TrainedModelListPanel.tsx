import type { Model, Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

export function TrainedModelListPanel({
  models,
  selectedId,
  profile,
  onSelect,
}: {
  models: Model[];
  selectedId: string;
  profile: Profile;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="w-48 shrink-0 border-r border-border bg-sidebar p-2">
      <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
        Trained Models
      </div>
      <div className="flex flex-col gap-1">
        {models.map((model) => {
          const active = model.id === selectedId;
          const dataset = profile.datasets.find((d) => d.id === model.datasetId);
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model.id)}
              className={cn(
                "rounded-sm px-3 py-2 text-left",
                active
                  ? "border-l-2 border-primary bg-primary/10 text-primary"
                  : "border-l-2 border-transparent text-foreground hover:bg-surface-2",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold">{model.name}</span>
                {model.active && (
                  <span className="rounded-sm border border-success/40 bg-success/20 px-1 py-0.5 text-[7px] font-black uppercase text-success">
                    Active
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "mt-0.5 text-[9px] font-bold",
                  active ? "text-primary/60" : "text-muted-foreground",
                )}
              >
                {dataset?.name ?? "Unknown dataset"}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
