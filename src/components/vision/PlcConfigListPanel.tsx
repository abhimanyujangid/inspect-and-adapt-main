import type { PlcConfiguration } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { Btn } from "./ui";

export function PlcConfigListPanel({
  configs,
  selectedId,
  isNew,
  readOnly,
  onSelect,
  onActivate,
  onDeactivate,
}: {
  configs: PlcConfiguration[];
  selectedId: string | null;
  isNew: boolean;
  readOnly?: boolean;
  onSelect: (config: PlcConfiguration) => void;
  onActivate: (plcId: string) => void;
  onDeactivate: (plcId: string) => void;
}) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-sidebar p-2">
      <div className="flex flex-col gap-1">
        {configs.map((config) => {
          const selected = config.id === selectedId && !isNew;
          return (
            <div
              key={config.id}
              className={cn(
                "rounded-sm border-l-2 px-3 py-2",
                selected ? "border-primary bg-primary/10" : "border-transparent hover:bg-surface-2",
              )}
            >
              <button onClick={() => onSelect(config)} className="w-full text-left">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={cn(
                      "text-[11px] font-bold",
                      selected ? "text-primary" : "text-foreground",
                    )}
                  >
                    {config.name || "Unnamed"}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                      config.active
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {config.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div
                  className={cn(
                    "mt-0.5 font-mono-tabular text-[9px]",
                    selected ? "text-primary/70" : "text-muted-foreground",
                  )}
                >
                  {config.ip || "No IP set"}
                </div>
              </button>
              {!readOnly && (
                <div className="mt-2 flex gap-1">
                  {!config.active ? (
                    <Btn className="h-6 flex-1 text-[9px]" onClick={() => onActivate(config.id)}>
                      Activate
                    </Btn>
                  ) : (
                    <Btn
                      variant="outline"
                      className="h-6 flex-1 text-[9px]"
                      onClick={() => onDeactivate(config.id)}
                    >
                      Deactivate
                    </Btn>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {configs.length === 0 && (
          <p className="px-2 py-3 text-[10px] text-muted-foreground">No configurations yet.</p>
        )}
      </div>
    </aside>
  );
}
