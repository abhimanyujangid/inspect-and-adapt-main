import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { Badge, Btn } from "../ui";

const RECENT_INSPECTIONS = [
  { time: "10:42:18", pass: true, score: "0.12", conf: "98.4%" },
  { time: "10:42:15", pass: true, score: "0.08", conf: "99.1%" },
  { time: "10:42:12", pass: false, score: "0.67", conf: "91.2%" },
  { time: "10:42:09", pass: true, score: "0.15", conf: "97.8%" },
  { time: "10:42:06", pass: true, score: "0.11", conf: "98.6%" },
  { time: "10:42:03", pass: false, score: "0.72", conf: "88.5%" },
  { time: "10:42:00", pass: true, score: "0.09", conf: "99.0%" },
];

const HISTORY_IMAGE_COUNT = 50;

const HISTORY_IMAGES = Array.from({ length: HISTORY_IMAGE_COUNT }, (_, i) => {
  const n = HISTORY_IMAGE_COUNT - i;
  const mins = 42 - Math.floor(i / 10);
  const secs = 18 - (i % 10) * 2;
  return {
    index: n,
    time: `10:${String(mins).padStart(2, "0")}:${String(Math.max(secs, 0)).padStart(2, "0")}`,
    pass: i % 5 !== 2,
    score: (0.08 + (i % 7) * 0.05).toFixed(2),
  };
});

type OutputViewMode = "current" | "history";

export function DashboardPage({ profile }: { profile: Profile | null }) {
  const [running, setRunning] = useState(true);
  const [outputViewMode, setOutputViewMode] = useState<OutputViewMode>("current");

  const cameraName = profile?.cameraConfiguration.cameraName ?? "Basler acA2440-35um";
  const fps = profile?.cameraConfiguration.fps ?? "24";
  const modelVersion = profile?.models.find((m) => m.active)?.name ?? profile?.models[0]?.name ?? "v2.4";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Status strip */}
      <div className="toolbar-header flex shrink-0 items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <StatusPill label="Profile" value={profile?.capName ?? "— None —"} />
          <StatusPill label="Model" value={modelVersion} />
          <LedStatus label="Line Running" active={running} />
          <LedStatus label="PLC Linked" active={!!profile} />
        </div>
        <div className="flex items-center gap-4 font-mono-tabular text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>{fps} FPS</span>
          <span>GPU 41%</span>
          <span>Last 10:42:18</span>
        </div>
      </div>

      {/* Three-column body */}
      <div className="flex min-h-0 flex-1 gap-3 p-3">
        {/* Camera feed */}
        <FeedPanel
          title="Camera Feed"
          action={
            <Badge tone="primary">
              <span className="font-mono-tabular">{cameraName} · {fps} FPS</span>
            </Badge>
          }
          accent="primary"
          placeholder="Basler Camera"
          subtext="Live Feed"
        />

        {/* Output (marked) */}
        <FeedPanel
          title="Output (Marked)"
          action={
            <OutputViewToggle value={outputViewMode} onChange={setOutputViewMode} />
          }
          accent="warning"
        >
          {outputViewMode === "current" ? (
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Output</div>
              <div className="mt-1 text-[10px] text-muted-foreground">No capture yet</div>
            </div>
          ) : (
            <OutputHistoryViewer />
          )}
        </FeedPanel>

        {/* Stats sidebar */}
        <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
            <SidebarCard>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Classification Result</div>
              <div className="mt-2 text-center font-mono-tabular text-4xl font-bold text-muted-foreground">— — —</div>
            </SidebarCard>

            <SidebarCard>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Confidence</div>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <MiniStat label="Regions" value="0" />
                <MiniStat label="ROI" value="—" />
                <MiniStat label="Inference" value="— ms" />
                <MiniStat label="Total" value="— ms" />
              </div>
            </SidebarCard>

            <SidebarCard>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Defect Score</div>
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
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Statistics</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <CountStat label="Total" value="0" tone="primary" />
                <CountStat label="Good" value="0" tone="success" />
                <CountStat label="Defects" value="0" tone="destructive" />
              </div>
            </SidebarCard>

            <SidebarCard>
              <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Recent Inspections</div>
              <ul className="mt-2 space-y-1">
                {RECENT_INSPECTIONS.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 border-b border-border py-1 text-[10px] last:border-0">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", item.pass ? "bg-success" : "bg-destructive")} />
                    <span className="font-mono-tabular text-muted-foreground">{item.time}</span>
                    <span className={cn("font-bold uppercase", item.pass ? "text-success" : "text-destructive")}>
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
      </div>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-[10px] font-bold text-foreground">{value}</span>
    </div>
  );
}

function LedStatus({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", active ? "bg-success" : "bg-muted-foreground")} />
      <span className={cn("text-[9px] font-bold uppercase tracking-wider", active ? "text-success" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}

function FeedPanel({
  title,
  action,
  accent,
  placeholder,
  subtext,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  accent: "primary" | "warning";
  placeholder?: string;
  subtext?: string;
  children?: React.ReactNode;
}) {
  const cornerColor = accent === "primary" ? "border-primary" : "border-warning";
  return (
    <section className="panel flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-8 shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{title}</h3>
        {action}
      </header>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#e8eaee] grid-bg">
        <CornerBrackets color={cornerColor} />
        {children ?? (
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{placeholder}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{subtext}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function OutputViewToggle({
  value,
  onChange,
}: {
  value: OutputViewMode;
  onChange: (mode: OutputViewMode) => void;
}) {
  return (
    <div className="flex h-6 rounded-sm border border-border bg-surface">
      <button
        type="button"
        onClick={() => onChange("current")}
        className={cn(
          "rounded-sm px-2.5 text-[9px] font-bold uppercase tracking-wider",
          value === "current" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Current
      </button>
      <button
        type="button"
        onClick={() => onChange("history")}
        className={cn(
          "rounded-sm px-2.5 text-[9px] font-bold uppercase tracking-wider",
          value === "history" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        Last 50
      </button>
    </div>
  );
}

function OutputHistoryViewer() {
  const [index, setIndex] = useState(0);
  const image = HISTORY_IMAGES[index];
  const atStart = index === 0;
  const atEnd = index === HISTORY_IMAGE_COUNT - 1;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-3 py-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Image Buffer</span>
        <div className="flex items-center gap-3 font-mono-tabular text-[10px]">
          <span className="text-muted-foreground">{image.time}</span>
          <span className={cn("font-bold uppercase", image.pass ? "text-success" : "text-destructive")}>
            {image.pass ? "Pass" : "Fail"}
          </span>
          <span className="text-muted-foreground">Score {image.score}</span>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <div className="font-mono-tabular text-5xl font-bold text-muted-foreground/40">{image.index}</div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Marked Output</div>
          <div className="mt-1 text-[10px] text-muted-foreground">No image loaded</div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <NavBtn label="First" disabled={atStart} onClick={() => setIndex(0)}>
              <ChevronsLeft className="h-3 w-3" />
            </NavBtn>
            <NavBtn label="Prev" disabled={atStart} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              <ChevronLeft className="h-3 w-3" />
            </NavBtn>
          </div>

          <div className="text-center">
            <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">Position</div>
            <div className="font-mono-tabular text-sm font-bold text-foreground">
              {String(index + 1).padStart(2, "0")} / {HISTORY_IMAGE_COUNT}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <NavBtn label="Next" disabled={atEnd} onClick={() => setIndex((i) => Math.min(HISTORY_IMAGE_COUNT - 1, i + 1))}>
              <ChevronRight className="h-3 w-3" />
            </NavBtn>
            <NavBtn label="Last" disabled={atEnd} onClick={() => setIndex(HISTORY_IMAGE_COUNT - 1)}>
              <ChevronsRight className="h-3 w-3" />
            </NavBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-sm border border-border bg-card px-2 text-[9px] font-bold uppercase tracking-wider",
        disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-foreground hover:bg-surface",
      )}
    >
      {children}
      {label}
    </button>
  );
}

function CornerBrackets({ color }: { color: string }) {
  const s = `absolute h-4 w-4 ${color}`;
  return (
    <>
      <span className={cn(s, "top-2 left-2 border-t-2 border-l-2")} />
      <span className={cn(s, "top-2 right-2 border-t-2 border-r-2")} />
      <span className={cn(s, "bottom-2 left-2 border-b-2 border-l-2")} />
      <span className={cn(s, "bottom-2 right-2 border-b-2 border-r-2")} />
    </>
  );
}

function SidebarCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("panel shrink-0 p-3", className)}>{children}</div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-surface px-2 py-1.5">
      <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono-tabular text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function CountStat({ label, value, tone }: { label: string; value: string; tone: "primary" | "success" | "destructive" }) {
  const c = { primary: "text-primary", success: "text-success", destructive: "text-destructive" }[tone];
  return (
    <div className="border border-border bg-surface px-2 py-1.5 text-center">
      <div className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-mono-tabular text-xl font-bold", c)}>{value}</div>
    </div>
  );
}
