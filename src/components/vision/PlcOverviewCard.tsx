import type { PlcConfiguration } from "@/lib/vision-storage";
import { PLC_PARAM_LABELS } from "@/lib/vision-plc";
import { ReadOnlyField } from "./ReadOnlyField";
import { Badge } from "./ui";

export function PlcOverviewCard({ plc }: { plc: PlcConfiguration }) {
  return (
    <div className="rounded-sm border border-success/40 bg-surface p-3">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            {plc.name || "Unnamed"}
          </span>
          <Badge tone="success">ACTIVE</Badge>
        </div>
        <span className="font-mono-tabular text-[11px] text-muted-foreground">
          {plc.ip || "No IP"}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        <ReadOnlyField label="IP Address" value={plc.ip || "—"} />
        <ReadOnlyField label="Rack" value={plc.rack} />
        <ReadOnlyField label="Slot" value={plc.slot} />
        <ReadOnlyField label="DB Number" value={plc.dbNumber} />
      </div>
      <div className="mt-3 border-t border-border pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          Parameters
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {(Object.keys(plc.params) as (keyof typeof plc.params)[]).map((key) => (
            <ReadOnlyField key={key} label={PLC_PARAM_LABELS[key] ?? key} value={plc.params[key]} />
          ))}
        </div>
      </div>
    </div>
  );
}
