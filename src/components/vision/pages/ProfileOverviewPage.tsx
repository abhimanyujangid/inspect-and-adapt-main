import {
  Cable,
  Camera,
  Images,
  Brain,
  Boxes,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { Profile, PlcConfiguration, CameraConfiguration, Dataset, Model } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { Badge } from "../ui";

/* ── Param labels ─────────────────────────────────────────────── */

const PLC_PARAM_LABELS: Record<string, string> = {
  encoderPpr: "Encoder PPR",
  pulsesPerCap: "Pulses / Cap",
  triggerPulseMs: "Trigger Pulse (ms)",
  lightTriggerMs: "Light Trigger (ms)",
  resultWaitMs: "Result Wait (ms)",
  triggerDelayMs: "Trigger Delay (ms)",
  triggerDelayCount: "Trigger Delay Count",
  sovOnTimeMs: "SOV ON Time (ms)",
  rejectDelayCount: "Reject Delay Count",
};

/* ── Main component ───────────────────────────────────────────── */

export function ProfileOverviewPage({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="text-center">
          <Boxes className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">No Active Profile</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Create or activate a profile to view its configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header strip — maps to QFrame with border-bottom */}
      <div className="shrink-0 border-b-2 border-primary bg-surface px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-primary-foreground">
              P
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-primary">
                {profile.capName}
              </h1>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Active Profile · Created{" "}
                {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <Badge tone="success">● ACTIVE</Badge>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-3 p-5">
          {/* Quick stats row — maps to QHBoxLayout with QFrame cards */}
          <div className="grid grid-cols-4 gap-2">
            <QuickStat label="PLC Configs" value={String(profile.plcConfigurations.length)} icon={Cable} />
            <QuickStat
              label="Camera"
              value={profile.cameraConfiguration.cameraName.split(" ").slice(-1)[0]}
              icon={Camera}
            />
            <QuickStat label="Datasets" value={String(profile.datasets.length)} icon={Images} />
            <QuickStat label="Models" value={String(profile.models.length)} icon={Brain} />
          </div>

          {/* PLC Configurations — maps to QToolBox / QTreeWidget */}
          <CollapsibleSection
            icon={Cable}
            title="PLC Configurations"
            count={profile.plcConfigurations.length}
            defaultOpen
          >
            {profile.plcConfigurations.length === 0 ? (
              <EmptyHint>No PLC configurations set.</EmptyHint>
            ) : (
              <div className="space-y-2">
                {profile.plcConfigurations.map((plc) => (
                  <PlcCard key={plc.id} plc={plc} />
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Camera Configuration */}
          <CollapsibleSection icon={Camera} title="Camera Configuration" defaultOpen>
            <CameraCard cam={profile.cameraConfiguration} />
          </CollapsibleSection>

          {/* Datasets — maps to QTableWidget */}
          <CollapsibleSection
            icon={Images}
            title="Datasets & Gallery"
            count={profile.datasets.length}
          >
            {profile.datasets.length === 0 ? (
              <EmptyHint>No datasets created yet.</EmptyHint>
            ) : (
              <div className="space-y-1">
                {profile.datasets.map((ds) => (
                  <DatasetRow key={ds.id} ds={ds} />
                ))}
              </div>
            )}
          </CollapsibleSection>

          {/* Trained Models */}
          <CollapsibleSection
            icon={Boxes}
            title="Trained Models"
            count={profile.models.length}
          >
            {profile.models.length === 0 ? (
              <EmptyHint>No models trained yet.</EmptyHint>
            ) : (
              <div className="space-y-1">
                {profile.models.map((model) => (
                  <ModelRow key={model.id} model={model} datasets={profile.datasets} />
                ))}
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ───────────────────────────────────────────── */

function QuickStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 border border-border bg-card p-3 rounded-sm">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <div className="font-mono-tabular text-lg font-bold text-foreground">{value}</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/**
 * Collapsible section — maps to QToolBox item in PySide6.
 * Click header to toggle content visibility.
 */
function CollapsibleSection({
  icon: Icon,
  title,
  count,
  defaultOpen = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden border border-border bg-card rounded-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left bg-surface-2 hover:bg-surface"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="flex-1 text-[11px] font-bold uppercase tracking-wider text-foreground">{title}</span>
        {count !== undefined && (
          <span className="font-mono-tabular text-[11px] font-bold text-muted-foreground">
            [{count}]
          </span>
        )}
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-border p-4">{children}</div>}
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-[11px] text-muted-foreground">{children}</p>;
}

/* ── PLC Card ─────────────────────────────────────────────────── */

function PlcCard({ plc }: { plc: PlcConfiguration }) {
  return (
    <div className="border border-border bg-surface p-3 rounded-sm">
      <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">{plc.name || "Unnamed"}</span>
        <span className="font-mono-tabular text-[11px] text-muted-foreground">{plc.ip || "No IP"}</span>
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
            <ReadOnlyField
              key={key}
              label={PLC_PARAM_LABELS[key] ?? key}
              value={plc.params[key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Camera Card ──────────────────────────────────────────────── */

function CameraCard({ cam }: { cam: CameraConfiguration }) {
  const roi = cam.roi;
  return (
    <div className="space-y-3">
      {/* Image parameters */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        <ReadOnlyField label="Camera" value={cam.cameraName} />
        <ReadOnlyField label="Exposure (µs)" value={cam.exposure} />
        <ReadOnlyField label="Gain" value={cam.gain} />
        <ReadOnlyField label="FPS" value={cam.fps} />
        <ReadOnlyField label="Pixel Format" value={cam.pixelFormat} />
        <ReadOnlyField label="Trigger Mode" value={cam.triggerMode} />
        <ReadOnlyField label="Cap Type" value={cam.capType} />
      </div>

      {/* ROI */}
      <div className="border-t border-border pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          Region of Interest
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          <ReadOnlyField label="X" value={String(roi.x)} />
          <ReadOnlyField label="Y" value={String(roi.y)} />
          <ReadOnlyField label="Width" value={String(roi.width)} />
          <ReadOnlyField label="Height" value={String(roi.height)} />
        </div>
        <div className="mt-2 border border-border bg-surface px-3 py-1.5 rounded-sm text-[10px] font-mono-tabular text-muted-foreground">
          Area: {(roi.width * roi.height).toLocaleString()} px² — Center: ({roi.x + Math.round(roi.width / 2)}, {roi.y + Math.round(roi.height / 2)})
        </div>
      </div>

      {/* HSV table — maps to QTableWidget in PySide6 */}
      <div className="border-t border-border pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          HSV Pre-Processing
        </div>
        <div className="overflow-hidden border border-border rounded-sm">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-surface-2">
                <th className="px-3 py-1.5 text-left text-[9px] font-bold uppercase tracking-wider text-muted-foreground w-20" />
                <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Hue</th>
                <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Saturation</th>
                <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Brightness</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Lower</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.hueLower}</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.satLower}</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.brightLower}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Upper</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.hueUpper}</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.satUpper}</td>
                <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">{cam.hsv.brightUpper}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Dataset Row ──────────────────────────────────────────────── */

function DatasetRow({ ds }: { ds: Dataset }) {
  return (
    <div className="flex items-center justify-between border border-border bg-surface px-4 py-2.5 rounded-sm">
      <div className="flex items-center gap-3">
        <Images className="h-3.5 w-3.5 text-primary" />
        <div>
          <div className="text-[11px] font-bold text-foreground">{ds.name}</div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            {ds.images.length} image{ds.images.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      {/* Thumbnail strip */}
      {ds.images.length > 0 && (
        <div className="flex gap-1">
          {ds.images.slice(0, 4).map((img) => (
            <div key={img.id} className="h-7 w-7 overflow-hidden border border-border bg-[#111318] rounded-sm">
              <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
            </div>
          ))}
          {ds.images.length > 4 && (
            <div className="flex h-7 w-7 items-center justify-center border border-border bg-surface-2 rounded-sm text-[8px] font-bold text-muted-foreground">
              +{ds.images.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Model Row ────────────────────────────────────────────────── */

function ModelRow({ model, datasets }: { model: Model; datasets: Dataset[] }) {
  const ds = datasets.find((d) => d.id === model.datasetId);
  return (
    <div className={cn(
      "flex items-center justify-between border bg-surface px-4 py-2.5 rounded-sm",
      model.active ? "border-success/40" : "border-border",
    )}>
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

/* ── Read-only field — maps to QLabel pair in PySide6 ─────────── */

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono-tabular text-[12px] font-bold text-foreground">{value || "—"}</div>
    </div>
  );
}
