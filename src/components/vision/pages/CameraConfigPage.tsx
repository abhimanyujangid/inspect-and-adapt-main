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
      <div className="shrink-0 border-b border-border bg-sidebar/40 px-6 py-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Camera Configuration</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Configure and preview cameras — settings saved per camera
            </p>
          </div>
          <div className="w-56 shrink-0">
            <Field label="Select camera">
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
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <div className="shrink-0 p-6 pb-0 xl:w-[58%] xl:pb-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                Live Inspection
              </div>
              <span className="font-normal opacity-90">({draft.fps}-FPS)</span>
            </div>
            <div className="aspect-[4/3] bg-black" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6 xl:pt-6">
          <ConfigCard title="Image Parameters">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Exposure (us)" hint="Min: 100 - Max: 100,000">
                <Input type="number" value={draft.exposure} onChange={(e) => set("exposure", e.target.value)} disabled={disabled} />
              </Field>
              <Field label="Gain" hint="Min: 0 - Max: 24.0">
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
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Btn variant="success"><Upload className="h-3.5 w-3.5" /> Load Image</Btn>
                <Btn variant="danger">Trigger Camera</Btn>
              </div>
            )}
          </ConfigCard>

          <ConfigCard title="Region Of Interest">
            <div className="grid grid-cols-2 gap-4">
              <Field label="X Origin"><Input type="number" value={draft.roi.x} onChange={(e) => updateRoi("x", e.target.value)} disabled={disabled} /></Field>
              <Field label="Y Origin"><Input type="number" value={draft.roi.y} onChange={(e) => updateRoi("y", e.target.value)} disabled={disabled} /></Field>
              <Field label="Width"><Input type="number" value={draft.roi.width} onChange={(e) => updateRoi("width", e.target.value)} disabled={disabled} /></Field>
              <Field label="Height"><Input type="number" value={draft.roi.height} onChange={(e) => updateRoi("height", e.target.value)} disabled={disabled} /></Field>
            </div>
            <div className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              Area: {roiStats.area.toLocaleString()} PX² — Center: ({roiStats.cx}, {roiStats.cy})
            </div>
            {!readOnly && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <Btn variant="success"><Upload className="h-3.5 w-3.5" /> Load Image</Btn>
                <Btn><Crop className="h-3.5 w-3.5" /> Apply ROI</Btn>
              </div>
            )}
          </ConfigCard>

          <ConfigCard title="Pre Processing">
            <Field label="Cap Type">
              <Select value={draft.capType} onChange={(e) => set("capType", e.target.value)} disabled={disabled}>
                <option>Bally Blue Caps</option><option>Red Caps Line B</option><option>Standard Bottle Cap</option>
              </Select>
            </Field>
            <div className="mt-4 overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2" />
                    <th className="px-3 py-2 text-center font-medium">Hue</th>
                    <th className="px-3 py-2 text-center font-medium">Saturation</th>
                    <th className="px-3 py-2 text-center font-medium">Brightness</th>
                  </tr>
                </thead>
                <tbody>
                  {(["Lower", "Upper"] as const).map((row) => (
                    <tr key={row} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 font-medium text-muted-foreground">{row}:</td>
                      {(["hue", "sat", "bright"] as const).map((col) => {
                        const key = `${col}${row}` as keyof CameraConfiguration["hsv"];
                        return (
                          <td key={key} className="px-2 py-2">
                            <Input type="number" className="h-8 text-center" value={draft.hsv[key]} onChange={(e) => updateHsv(key, e.target.value)} disabled={disabled} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!readOnly && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn variant="success"><Upload className="h-3.5 w-3.5" /> Load Image</Btn>
                <Btn variant="danger">Trigger Camera</Btn>
              </div>
            )}
          </ConfigCard>

          {!readOnly && (
            <div className="flex justify-end">
              <Btn onClick={saveSettings}>
                <Save className="h-3.5 w-3.5" />
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
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
