import { useState } from "react";
import { Save } from "lucide-react";
import { PageHeader } from "../ui";
import { createId, type ProfilePageProps } from "@/lib/vision-storage";

export function ModelTrainingPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const [label, setLabel] = useState("Test Model");
  const [datasetId, setDatasetId] = useState(profile.datasets[0]?.id ?? "");
  const [backbone, setBackbone] = useState("PatchCore");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [training, setTraining] = useState(false);

  const datasets = profile.datasets;

  const trainModel = () => {
    if (!datasetId || !label.trim()) return;
    setTraining(true);
    setProgress(10);
    setLogs([
      `${time()} - Loading dataset...`,
      `${time()} - Preprocessing images...`,
    ]);

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 15, 100);
        if (next >= 100) {
          clearInterval(interval);
          const model = {
            id: createId("model"),
            name: label.trim(),
            datasetId,
            status: "trained" as const,
            active: false,
            threshold: "0.56",
          };
          onUpdate({ ...profile, models: [...profile.models, model] });
          setLogs((prev) => [...prev, `${time()} - Training complete. Model saved.`]);
          setTraining(false);
        }
        return next;
      });
    }, 400);
  };

  return (
    <>
      <PageHeader
        title="Model Training"
        subtitle="Configure and monitor training jobs — settings saved on start"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          <section>
            <h2 className="text-base font-semibold text-foreground">Training Configuration</h2>
            <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Training Label">
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={readOnly}
                    className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                </Field>
                <Field label="Datasets">
                  <select
                    value={datasetId}
                    onChange={(e) => setDatasetId(e.target.value)}
                    disabled={readOnly}
                    className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                  >
                    {datasets.length === 0 && <option value="">No datasets</option>}
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.images.length} Images)
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Backbone">
                  <input
                    value={backbone}
                    placeholder="PatchCore"
                    onChange={(e) => setBackbone(e.target.value)}
                    disabled={readOnly}
                    className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-60"
                  />
                </Field>
              </div>

              {!readOnly && (
                <button
                  onClick={trainModel}
                  disabled={training || !datasetId}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Train Model
                </button>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Progress</h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {training ? "Training in progress..." : progress >= 100 ? "Complete" : "Idle"}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{progress}%</span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground">Activity Log</h2>
              <div className="mt-4 min-h-[360px] rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  {logs.length === 0 && (
                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                  )}
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

function time() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
