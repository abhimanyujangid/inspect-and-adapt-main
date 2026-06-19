import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECENT_INSPECTIONS } from "@/lib/vision-mock-data";
import { Btn } from "./ui";

function SidebarCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("panel shrink-0 p-3", className)}>{children}</div>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-surface px-2 py-1.5">
      <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono-tabular text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function CountStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "success" | "destructive";
}) {
  const c = { primary: "text-primary", success: "text-success", destructive: "text-destructive" }[
    tone
  ];
  return (
    <div className="border border-border bg-surface px-2 py-1.5 text-center">
      <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("font-mono-tabular text-xl font-bold", c)}>{value}</div>
    </div>
  );
}

export function DashboardStatsPanel() {
  return (
    <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
        <SidebarCard>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Classification Result
          </div>
          <div className="mt-2 text-center font-mono-tabular text-4xl font-bold text-muted-foreground">
            — — —
          </div>
        </SidebarCard>

        <SidebarCard>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Confidence
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <MiniStat label="Regions" value="0" />
            <MiniStat label="ROI" value="—" />
            <MiniStat label="Inference" value="— ms" />
            <MiniStat label="Total" value="— ms" />
          </div>
        </SidebarCard>

        <SidebarCard>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Defect Score
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="font-mono-tabular text-4xl font-bold text-foreground">0.000</span>
            <span className="text-sm text-muted-foreground">/ 1.000</span>
          </div>
          <div className="mt-2 flex justify-center gap-3 text-[9px] font-bold uppercase tracking-wider">
            <span className="text-destructive">≥ 0.50 = Defect</span>
            <span className="text-success">&lt; 0.50 = Good</span>
          </div>
        </SidebarCard>

        <SidebarCard>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Statistics
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <CountStat label="Total" value="0" tone="primary" />
            <CountStat label="Good" value="0" tone="success" />
            <CountStat label="Defects" value="0" tone="destructive" />
          </div>
        </SidebarCard>

        <SidebarCard>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Recent Inspections
          </div>
          <ul className="mt-2 space-y-1">
            {RECENT_INSPECTIONS.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2 border-b border-border py-1 text-[10px] last:border-0"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    item.pass ? "bg-success" : "bg-destructive",
                  )}
                />
                <span className="font-mono-tabular text-muted-foreground">{item.time}</span>
                <span
                  className={cn(
                    "font-bold uppercase",
                    item.pass ? "text-success" : "text-destructive",
                  )}
                >
                  {item.pass ? "Pass" : "Fail"}
                </span>
                <span className="ml-auto font-mono-tabular text-muted-foreground">
                  {item.score} {item.conf}
                </span>
              </li>
            ))}
          </ul>
        </SidebarCard>
      </div>

      <div className="shrink-0 border-t border-border bg-background pt-2">
        <Btn variant="outline" className="h-9 w-full">
          <RotateCcw className="h-3 w-3" /> Reset
        </Btn>
      </div>
    </aside>
  );
}
