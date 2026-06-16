import { useEffect, useMemo, useState } from "react";
import { Field, Input, Select, Btn } from "../ui";
import { Save, Upload, Crop } from "lucide-react";
import type { CameraConfiguration, ProfilePageProps } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

const CAMERAS = ["Basler acA1300-60gc", "Basler acA2440-35um", "FLIR BFS-PGE-50S5M"];

export function CameraConfigPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const cam = profile.cameraConfiguration;
  const [draft, setDraft] = useState<CameraConfiguration>(cam);

  useEffect(() => {
    setDraft(cam);
  }, [profile.id]);

  const roiStats = useMemo(() => {
    const area = draft.roi.width * draft.roi.height;
    const cx = draft.roi.x + Math.round(draft.roi.width / 2);
    const cy = draft.roi.y + Math.round(draft.roi.height / 2);
    return { area, cx, cy };
  }, [draft.roi]);

  const set = <K extends keyof CameraConfiguration>(key: K, value: CameraConfiguration[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateRoi = (key: keyof CameraConfiguration["roi"], value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setDraft((prev) => ({ ...prev, roi: { ...prev.roi, [key]: n } }));
  };

  const updateHsv = (key: keyof CameraConfiguration["hsv"], value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setDraft((prev) => ({ ...prev, hsv: { ...prev.hsv, [key]: n } }));
  };

  const saveSettings = () => {
    onUpdate({ ...profile, cameraConfiguration: draft });
  };

  const disabled = readOnly;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header with camera selector */}
      <div className="shrink-0 flex items-end justify-between border-b-2 border-primary bg-surface px-5 py-3">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-primary">Camera Configuration</h1>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Configure and preview cameras — settings saved per camera
          </p>
        </div>
        <div className="w-52 shrink-0">
          <Field label="Select Camera">
            <Select
              value={draft.cameraName}
              onChange={(e) => set("cameraName", e.target.value)}
              disabled={disabled}
            >
              {CAMERAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        {/* Live preview — maps to QLabel with pixmap */}
        <div className="shrink-0 p-5 pb-0 xl:w-[58%] xl:pb-5">
          <div className="overflow-hidden border border-border bg-card rounded-sm">
            <div className="flex items-center justify-between bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Live Inspection
              </div>
              <span className="font-mono-tabular">{draft.fps} FPS</span>
            </div>
            <div className="aspect-[4/3] bg-[#111318] grid-bg" />
          </div>
        </div>

        {/* Config panels */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 xl:pt-5">
          <ConfigCard title="Image Parameters">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Exposure (µs)" hint="Min: 100 – Max: 100,000">
                <Input type="number" value={draft.exposure} onChange={(e) => set("exposure", e.target.value)} disabled={disabled} />
              </Field>
              <Field label="Gain" hint="Min: 0 – Max: 24.0">
                <Select value={draft.gain} onChange={(e) => set("gain", e.target.value)} disabled={disabled}>
                  <option>Mono8</option><option>4.0</option><option>8.0</option><option>12.0</option>
                </Select>
              </Field>
              <Field label="FPS">
                <Input type="number" value={draft.fps} onChange={(e) => set("fps", e.target.value)} disabled={disabled} />
              </Field>
              <Field label="Pixel Format">
                <Select value={draft.pixelFormat} onChange={(e) => set("pixelFormat", e.target.value)} disabled={disabled}>
                  <option>Mono8</option><option>Mono12</option><option>BayerRG8</option>
                </Select>
              </Field>
              <div className="col-span-2">
                <Field label="Trigger Mode">
                  <Select value={draft.triggerMode} onChange={(e) => set("triggerMode", e.target.value)} disabled={disabled}>
                    <option>Hardware Trigger</option><option>Software Trigger</option><option>Free-run</option>
                  </Select>
                </Field>
              </div>
            </div>
            {!readOnly && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Btn variant="success"><Upload className="h-3 w-3" /> Load Image</Btn>
                <Btn variant="danger">Trigger Camera</Btn>
              </div>
            )}
          </ConfigCard>

          <ConfigCard title="Region of Interest">
            <div className="grid grid-cols-2 gap-3">
              <Field label="X Origin"><Input type="number" value={draft.roi.x} onChange={(e) => updateRoi("x", e.target.value)} disabled={disabled} /></Field>
              <Field label="Y Origin"><Input type="number" value={draft.roi.y} onChange={(e) => updateRoi("y", e.target.value)} disabled={disabled} /></Field>
              <Field label="Width"><Input type="number" value={draft.roi.width} onChange={(e) => updateRoi("width", e.target.value)} disabled={disabled} /></Field>
              <Field label="Height"><Input type="number" value={draft.roi.height} onChange={(e) => updateRoi("height", e.target.value)} disabled={disabled} /></Field>
            </div>
            <div className="mt-3 border border-border bg-surface px-3 py-1.5 rounded-sm font-mono-tabular text-[10px] text-muted-foreground">
              Area: {roiStats.area.toLocaleString()} px² — Center: ({roiStats.cx}, {roiStats.cy})
            </div>
            {!readOnly && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Btn variant="success"><Upload className="h-3 w-3" /> Load Image</Btn>
                <Btn><Crop className="h-3 w-3" /> Apply ROI</Btn>
              </div>
            )}
          </ConfigCard>

          <ConfigCard title="Pre Processing">
            <Field label="Cap Type">
              <Select value={draft.capType} onChange={(e) => set("capType", e.target.value)} disabled={disabled}>
                <option>Bally Blue Caps</option><option>Red Caps Line B</option><option>Standard Bottle Cap</option>
              </Select>
            </Field>
            {/* HSV table — maps to QTableWidget */}
            <div className="mt-3 overflow-hidden border border-border rounded-sm">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground" />
                    <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Hue</th>
                    <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Saturation</th>
                    <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Brightness</th>
                  </tr>
                </thead>
                <tbody>
                  {(["Lower", "Upper"] as const).map((row) => (
                    <tr key={row} className="border-b border-border last:border-0">
                      <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">{row}:</td>
                      {(["hue", "sat", "bright"] as const).map((col) => {
                        const key = `${col}${row}` as keyof CameraConfiguration["hsv"];
                        return (
                          <td key={key} className="px-2 py-1.5">
                            <Input type="number" className="h-7 text-center" value={draft.hsv[key]} onChange={(e) => updateHsv(key, e.target.value)} disabled={disabled} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!readOnly && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn variant="success"><Upload className="h-3 w-3" /> Load Image</Btn>
                <Btn variant="danger">Trigger Camera</Btn>
              </div>
            )}
          </ConfigCard>

          {!readOnly && (
            <div className="flex justify-end">
              <Btn onClick={saveSettings}>
                <Save className="h-3 w-3" />
                Save Settings
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfigCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card rounded-sm">
      <header className="border-b-2 border-primary bg-surface-2 px-4 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
