import type { Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-[10px] font-bold text-foreground">{value}</span>
    </div>
  );
}

function LedStatus({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", active ? "bg-success" : "bg-muted-foreground")} />
      <span
        className={cn(
          "text-[9px] font-bold uppercase tracking-wider",
          active ? "text-success" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function DashboardStatusBar({
  profile,
  modelVersion,
  fps,
}: {
  profile: Profile | null;
  modelVersion: string;
  fps: string;
}) {
  return (
    <div className="toolbar-header flex shrink-0 items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <StatusPill label="Profile" value={profile?.capName ?? "— None —"} />
        <StatusPill label="Model" value={modelVersion} />
        <LedStatus label="Line Running" active />
        <LedStatus label="PLC Linked" active={!!profile} />
      </div>
      <div className="flex items-center gap-4 font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        <span>{fps} FPS</span>
        <span>GPU 41%</span>
        <span>Last 10:42:18</span>
      </div>
    </div>
  );
}
