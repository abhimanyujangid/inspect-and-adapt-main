import type { Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

export function DashboardPage({ profile }: { profile: Profile | null }) {
  return (
    <div className="p-5">
      {/* Page title strip */}
      <div className="flex items-center justify-between border-b-2 border-primary pb-3">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-primary">Dashboard</h1>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Live Inspection Overview
            {profile ? ` · ${profile.capName}` : " · No Active Profile"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-success">RUNNING</span>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        <Kpi label="Throughput" value="1,248" delta="+8.2%" deltaTone="success" />
        <Kpi label="Pass Rate" value="97.4%" delta="+0.3%" deltaTone="success" />
        <Kpi label="Defects" value="32" delta="-4.1%" deltaTone="success" />
        <Kpi label="Cycle Time" value="1.2s" delta="stable" deltaTone="muted" />
      </div>

      {/* Status cards */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatusCard label="Line Status" value="Running" status="success" />
        <StatusCard label="PLC Link" value="Connected" status="success" />
        <StatusCard label="Model" value="v2.4 — idle" status="warning" />
      </div>

      {/* Camera feed placeholders */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <CameraTile n={1} />
        <CameraTile n={2} />
      </div>

      {/* Action buttons — maps to QPushButton row */}
      <div className="mt-4 flex gap-2">
        <button className="h-9 rounded-sm bg-primary px-5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110">
          Start Inspection
        </button>
        <button className="h-9 rounded-sm bg-warning px-5 text-[11px] font-bold uppercase tracking-wider text-warning-foreground hover:brightness-110">
          Pause Line
        </button>
        <button className="h-9 rounded-sm border border-border bg-surface px-5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:bg-surface-2">
          Export Report
        </button>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, deltaTone }: { label: string; value: string; delta: string; deltaTone: "success" | "muted" | "destructive" }) {
  const tone = { success: "text-success", muted: "text-muted-foreground", destructive: "text-destructive" }[deltaTone];
  return (
    <div className="border border-border bg-card p-4 rounded-sm">
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-mono-tabular text-3xl font-bold text-foreground">{value}</div>
      <div className={cn("mt-3 border-t border-border pt-2 text-[11px] font-bold", tone)}>{delta}</div>
    </div>
  );
}

function StatusCard({ label, value, status }: { label: string; value: string; status: "success" | "warning" | "destructive" }) {
  const ledColor = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" }[status];
  const borderColor = { success: "border-success/40", warning: "border-warning/40", destructive: "border-destructive/40" }[status];
  return (
    <div className={cn("border bg-card p-4 rounded-sm", borderColor)}>
      <div className="flex items-center justify-between">
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className={cn("h-2 w-2 rounded-full", ledColor)} />
      </div>
      <div className="mt-2 text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}

function CameraTile({ n }: { n: number }) {
  return (
    <div className="overflow-hidden border border-border bg-card rounded-sm">
      <div className="flex h-56 items-center justify-center bg-[#e8eaee] grid-bg text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Camera {n} — No Feed
      </div>
      <div className="flex items-center justify-between border-t border-border bg-surface-2 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">Camera {n}</span>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">STANDBY</span>
        </div>
      </div>
    </div>
  );
}
