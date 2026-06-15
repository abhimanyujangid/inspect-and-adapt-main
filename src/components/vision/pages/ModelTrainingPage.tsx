import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "../ui";

export function ModelTrainingPage() {
  const [label, setLabel] = useState("Test Model");
  const [dataset, setDataset] = useState("Blue Caps Batch 1 (128 Images)");
  const [backbone, setBackbone] = useState("");
  const progress = 10;
  const logs = [
    "15:36:24 - Loading dataset...",
    "15:36:38 - Preprocessing images...",
  ];

  return (
    <>
      <PageHeader
        title="Model Training"
        subtitle="Configure and monitor training jobs — settings saved on start"
      />

      <div className="p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Training Configuration */}
        <section>
          <h2 className="text-base font-semibold text-foreground">Training Configuration</h2>
          <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Training Label">
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </Field>
              <Field label="Datasets">
                <select
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option>Blue Caps Batch 1 (128 Images)</option>
                  <option>Red Caps Batch 2 (96 Images)</option>
                  <option>Crown Cap V1 (212 Images)</option>
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Backbone">
                <input
                  value={backbone}
                  placeholder="PatchCore"
                  onChange={(e) => setBackbone(e.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </Field>
            </div>

            <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Save className="h-4 w-4" /> Start Training
            </button>
          </div>
        </section>

        {/* Progress / Activity */}
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="text-base font-semibold text-foreground">Progress</h2>
            <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Preprocessing images...</span>
                <span className="text-sm font-semibold text-foreground">{progress}%</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">Activity Log</h2>
            <div className="mt-4 min-h-[360px] rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3">
                {logs.map((l) => (
                  <div
                    key={l}
                    className="rounded-md bg-[oklch(0.3_0.01_250)] px-4 py-3 text-sm text-[oklch(0.95_0_0)]"
                  >
                    {l}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
