import type { Profile } from "../VisionApp";
import { cn } from "@/lib/utils";

export function DashboardPage({ profile }: { profile: Profile }) {
  return (
    <div className="px-8 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Live inspection overview — backend integration pending · {profile.name}
      </p>

      <div className="mt-6 grid grid-cols-4 gap-5">
        <Kpi label="THROUGHPUT" value="1,248" delta="+8.2%" deltaTone="success" />
        <Kpi label="PASS RATE" value="97.4%" delta="+0.3%" deltaTone="success" />
        <Kpi label="DEFECTS" value="32" delta="-4.1%" deltaTone="success" />
        <Kpi label="CYCLE TIME" value="1.2s" delta="stable" deltaTone="muted" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5">
        <StatusCard label="LINE STATUS" value="Running" dot="success" />
        <StatusCard label="PLC LINK" value="Connected" dot="success" />
        <StatusCard label="MODEL" value="v2.4 — idle" dot="warning" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <CameraTile n={1} />
        <CameraTile n={2} />
      </div>

      <div className="mt-6 flex gap-3">
        <button className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Start Inspection</button>
        <button className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Pause Line</button>
        <button className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Export Report</button>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, deltaTone }: { label: string; value: string; delta: string; deltaTone: "success" | "muted" | "destructive" }) {
  const tone = { success: "text-success", muted: "text-muted-foreground", destructive: "text-destructive" }[deltaTone];
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="text-xs font-semibold tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-3 text-4xl font-bold text-foreground">{value}</div>
      <div className={cn("mt-6 text-sm font-medium", tone)}>{delta}</div>
    </div>
  );
}

function StatusCard({ label, value, dot }: { label: string; value: string; dot: "success" | "warning" | "destructive" }) {
  const c = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" }[dot];
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wider text-muted-foreground">{label}</div>
        <span className={cn("h-2.5 w-2.5 rounded-full", c)} />
      </div>
      <div className="mt-3 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function CameraTile({ n }: { n: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex h-64 items-center justify-center bg-[oklch(0.3_0.01_250)] text-sm text-[oklch(0.88_0_0)]">
        Camera {n} — placeholder
      </div>
      <div className="bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
        Camera {n} — placeholder
      </div>
    </div>
  );
}
