import { useMemo, useState } from "react";
import { Field, Input, Select, Btn } from "../ui";
import { Save, Upload, RotateCcw, Crop } from "lucide-react";
import { cn } from "@/lib/utils";

const CAMERAS = ["Basler acA1300-60gc", "Basler acA2440-35um", "FLIR BFS-PGE-50S5M"];

export function CameraConfigPage() {
  const [camera, setCamera] = useState(CAMERAS[0]);
  const [exposure, setExposure] = useState("30");
  const [gain, setGain] = useState("Mono8");
  const [fps, setFps] = useState("30");
  const [pixelFormat, setPixelFormat] = useState("Mono8");
  const [triggerMode, setTriggerMode] = useState("Hardware Trigger");
  const [roi, setRoi] = useState({ x: 87, y: 80, width: 600, height: 480 });
  const [capType, setCapType] = useState("Bally Blue Caps");
  const [hsv, setHsv] = useState({
    hueLower: 100, hueUpper: 100,
    satLower: 50, satUpper: 50,
    brightLower: 50, brightUpper: 50,
  });

  const roiStats = useMemo(() => {
    const area = roi.width * roi.height;
    const cx = roi.x + Math.round(roi.width / 2);
    const cy = roi.y + Math.round(roi.height / 2);
    return { area, cx, cy };
  }, [roi]);

  const updateRoi = (key: keyof typeof roi, value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setRoi((prev) => ({ ...prev, [key]: n }));
  };

  const updateHsv = (key: keyof typeof hsv, value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setHsv((prev) => ({ ...prev, [key]: n }));
  };

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
              <Select value={camera} onChange={(e) => setCamera(e.target.value)}>
                {CAMERAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        {/* Live feed — fixed while right column scrolls */}
        <div className="shrink-0 p-6 pb-0 xl:w-[58%] xl:pb-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
                Live Inspection
              </div>
              <span className="font-normal opacity-90">({fps}-FPS)</span>
            </div>
            <div className="aspect-[4/3] bg-black" />
          </div>
        </div>

        {/* Right column — scrollable settings */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6 xl:pt-6">
          {/* Image Parameters */}
          <ConfigCard title="Image Parameters">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Exposure (us)" hint="Min: 100 - Max: 100,000">
                <Input type="number" value={exposure} onChange={(e) => setExposure(e.target.value)} />
              </Field>
              <Field label="Gain" hint="Min: 0 - Max: 24.0">
                <Select value={gain} onChange={(e) => setGain(e.target.value)}>
                  <option>Mono8</option>
                  <option>4.0</option>
                  <option>8.0</option>
                  <option>12.0</option>
                </Select>
              </Field>
              <Field label="FPS">
                <Input type="number" value={fps} onChange={(e) => setFps(e.target.value)} />
              </Field>
              <Field label="Pixel Format">
                <Select value={pixelFormat} onChange={(e) => setPixelFormat(e.target.value)}>
                  <option>Mono8</option>
                  <option>Mono12</option>
                  <option>BayerRG8</option>
                </Select>
              </Field>
              <div className="col-span-2">
              <Field label="Trigger Mode">
                <Select value={triggerMode} onChange={(e) => setTriggerMode(e.target.value)}>
                  <option>Hardware Trigger</option>
                  <option>Software Trigger</option>
                  <option>Free-run</option>
                </Select>
              </Field>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Btn><Save className="h-3.5 w-3.5" /> Save Settings</Btn>
              <Btn><Upload className="h-3.5 w-3.5" /> Load Image</Btn>
              <Btn variant="outline"><RotateCcw className="h-3.5 w-3.5" /> Reset Settings</Btn>
            </div>
          </ConfigCard>

          {/* ROI */}
          <ConfigCard title="Region Of Interest">
            <div className="grid grid-cols-2 gap-4">
              <Field label="X Origin">
                <Input type="number" value={roi.x} onChange={(e) => updateRoi("x", e.target.value)} />
              </Field>
              <Field label="Y Origin">
                <Input type="number" value={roi.y} onChange={(e) => updateRoi("y", e.target.value)} />
              </Field>
              <Field label="Width">
                <Input type="number" value={roi.width} onChange={(e) => updateRoi("width", e.target.value)} />
              </Field>
              <Field label="Height">
                <Input type="number" value={roi.height} onChange={(e) => updateRoi("height", e.target.value)} />
              </Field>
            </div>
            <div className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              Area: {roiStats.area.toLocaleString()} PX² — Center: ({roiStats.cx}, {roiStats.cy})
            </div>
            <div className="mt-4 flex justify-end">
              <Btn><Crop className="h-3.5 w-3.5" /> Apply ROI</Btn>
            </div>
          </ConfigCard>

          {/* Pre Processing */}
          <ConfigCard title="Pre Processing">
            <Field label="Cap Type">
              <Select value={capType} onChange={(e) => setCapType(e.target.value)}>
                <option>Bally Blue Caps</option>
                <option>Red Caps Line B</option>
                <option>Standard Bottle Cap</option>
              </Select>
            </Field>

            <div className="mt-4 overflow-hidden rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground" />
                    <th className="px-3 py-2 text-center font-medium text-foreground">Hue</th>
                    <th className="px-3 py-2 text-center font-medium text-foreground">Saturation</th>
                    <th className="px-3 py-2 text-center font-medium text-foreground">Brightness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-3 py-2 font-medium text-muted-foreground">Lower:</td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.hueLower} onChange={(e) => updateHsv("hueLower", e.target.value)} />
                    </td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.satLower} onChange={(e) => updateHsv("satLower", e.target.value)} />
                    </td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.brightLower} onChange={(e) => updateHsv("brightLower", e.target.value)} />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-muted-foreground">Upper:</td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.hueUpper} onChange={(e) => updateHsv("hueUpper", e.target.value)} />
                    </td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.satUpper} onChange={(e) => updateHsv("satUpper", e.target.value)} />
                    </td>
                    <td className="px-2 py-2">
                      <Input type="number" className="h-8 text-center" value={hsv.brightUpper} onChange={(e) => updateHsv("brightUpper", e.target.value)} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Btn variant="success"><Upload className="h-3.5 w-3.5" /> Load Image</Btn>
              <Btn variant="danger">Trigger Camera</Btn>
            </div>
          </ConfigCard>
        </div>
      </div>
    </div>
  );
}

function ConfigCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-border bg-card shadow-sm", className)}>
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
