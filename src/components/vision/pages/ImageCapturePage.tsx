import { useState } from "react";
import { Images, Save, Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageCapturePage() {
  const [triggered, setTriggered] = useState(false);
  const [count, setCount] = useState(0);
  const captured = 65;
  const minimum = 100;
  const pct = Math.min(100, Math.round((captured / minimum) * 100));

  return (
    <div className="px-8 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Image Capture</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acquire training images — backend pending
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-surface-2">
            <Images className="h-4 w-4" /> Go to Image Gallery
          </button>
          <button className="flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Save className="h-4 w-4" /> Store and Save
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Live Preview */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            <span>Live Preview</span>
            <span>Dataset: Crown_cap_V1</span>
          </div>
          <div className="h-[440px] bg-[oklch(0.22_0.01_250)]" />
        </div>

        {/* Capture panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Image Captured</h2>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="grid grid-cols-[auto_1fr_1fr] items-end gap-5">
              <div className="text-5xl font-bold text-foreground leading-none">{captured}</div>

              <Field label="Select Camera">
                <Select options={["Select All", "Camera 1", "Camera 2"]} />
              </Field>

              <Field label="Select Dataset">
                <Select options={["Select All", "Crown_cap_V1", "Bottle_cap_V2"]} />
              </Field>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progress to minimum ({minimum})</span>
                <span className="font-semibold text-foreground">{pct}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Camera className="h-4 w-4" /> Capture Single Image
            </button>

            <button
              onClick={() => setTriggered((t) => !t)}
              className="mt-4 flex h-12 w-full items-center justify-between rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground hover:bg-surface-2"
            >
              <span>Triggered Based Capture</span>
              <span
                className={cn(
                  "relative h-6 w-11 rounded-full transition",
                  triggered ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all",
                    triggered ? "left-[22px]" : "left-0.5"
                  )}
                />
              </span>
            </button>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Field label="Number of Image to Capture">
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </Field>
              <div className="flex items-end">
                <button className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-semibold text-foreground hover:bg-surface-2">
                  <Play className="h-4 w-4" /> Start Capturing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Select({ options }: { options: string[] }) {
  return (
    <select className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
}
