import {
  Cable,
  Camera,
  Aperture,
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Boxes className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">No Active Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create or activate a profile to view its configuration here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-sidebar/40 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
            <Boxes className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {profile.capName}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Active profile · Created{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Badge tone="success">Active</Badge>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-4 p-6">
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-3">
            <QuickStat
              label="PLC Configs"
              value={String(profile.plcConfigurations.length)}
              icon={Cable}
            />
            <QuickStat
              label="Camera"
              value={profile.cameraConfiguration.cameraName.split(" ").slice(-1)[0]}
              icon={Camera}
            />
            <QuickStat
              label="Datasets"
              value={String(profile.datasets.length)}
              icon={Images}
            />
            <QuickStat
              label="Models"
              value={String(profile.models.length)}
              icon={Brain}
            />
          </div>

          {/* PLC Configurations */}
          <CollapsibleSection
            icon={Cable}
            title="PLC Configurations"
            count={profile.plcConfigurations.length}
            defaultOpen
          >
            {profile.plcConfigurations.length === 0 ? (
              <EmptyHint>No PLC configurations set.</EmptyHint>
            ) : (
              <div className="space-y-3">
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

          {/* Datasets / Gallery */}
          <CollapsibleSection
            icon={Images}
            title="Datasets & Gallery"
            count={profile.datasets.length}
          >
            {profile.datasets.length === 0 ? (
              <EmptyHint>No datasets created yet.</EmptyHint>
            ) : (
              <div className="space-y-2">
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
              <div className="space-y-2">
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
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

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
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-sidebar-accent/40"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="flex-1 text-sm font-semibold text-foreground">{title}</span>
        {count !== undefined && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {count}
          </span>
        )}
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground transition" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground transition" />
        )}
      </button>
      {open && <div className="border-t border-border px-5 py-4">{children}</div>}
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-sm text-muted-foreground">{children}</p>;
}

/* ── PLC Card ─────────────────────────────────────────────────── */

function PlcCard({ plc }: { plc: PlcConfiguration }) {
  return (
    <div className="rounded-md border border-border bg-sidebar/20 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{plc.name || "Unnamed"}</span>
        <span className="text-xs text-muted-foreground">{plc.ip || "No IP"}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-x-6 gap-y-2">
        <ReadOnlyField label="IP Address" value={plc.ip || "—"} />
        <ReadOnlyField label="Rack" value={plc.rack} />
        <ReadOnlyField label="Slot" value={plc.slot} />
        <ReadOnlyField label="DB Number" value={plc.dbNumber} />
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Parameters
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
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
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <ReadOnlyField label="Camera" value={cam.cameraName} />
        <ReadOnlyField label="Exposure (µs)" value={cam.exposure} />
        <ReadOnlyField label="Gain" value={cam.gain} />
        <ReadOnlyField label="FPS" value={cam.fps} />
        <ReadOnlyField label="Pixel Format" value={cam.pixelFormat} />
        <ReadOnlyField label="Trigger Mode" value={cam.triggerMode} />
        <ReadOnlyField label="Cap Type" value={cam.capType} />
      </div>

      <div className="border-t border-border pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Region of Interest
        </div>
        <div className="grid grid-cols-4 gap-x-6 gap-y-2">
          <ReadOnlyField label="X" value={String(roi.x)} />
          <ReadOnlyField label="Y" value={String(roi.y)} />
          <ReadOnlyField label="Width" value={String(roi.width)} />
          <ReadOnlyField label="Height" value={String(roi.height)} />
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          HSV Pre-Processing
        </div>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground" />
                <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Hue
                </th>
                <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saturation
                </th>
                <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Brightness
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-sm font-medium text-muted-foreground">Lower</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.hueLower}</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.satLower}</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.brightLower}</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-sm font-medium text-muted-foreground">Upper</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.hueUpper}</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.satUpper}</td>
                <td className="px-3 py-2 text-center text-sm text-foreground">{cam.hsv.brightUpper}</td>
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
    <div className="flex items-center justify-between rounded-md border border-border bg-sidebar/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Images className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{ds.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {ds.images.length} image{ds.images.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
      {/* Thumbnail strip */}
      {ds.images.length > 0 && (
        <div className="flex gap-1">
          {ds.images.slice(0, 4).map((img) => (
            <div
              key={img.id}
              className="h-8 w-8 overflow-hidden rounded border border-border bg-muted"
            >
              <img
                src={img.dataUrl}
                alt={img.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {ds.images.length > 4 && (
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-[10px] font-semibold text-muted-foreground">
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
    <div className="flex items-center justify-between rounded-md border border-border bg-sidebar/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md",
          model.active ? "bg-success/15" : "bg-primary/10",
        )}>
          <Brain className={cn("h-4 w-4", model.active ? "text-success" : "text-primary")} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{model.name}</span>
            {model.active && <Badge tone="success">Active</Badge>}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Dataset: {ds?.name ?? "Unknown"} · Threshold: {model.threshold}
          </div>
        </div>
      </div>
      <Badge tone={model.active ? "success" : "default"}>{model.status}</Badge>
    </div>
  );
}

/* ── Read-only field ──────────────────────────────────────────── */

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value || "—"}</div>
    </div>
  );
}
