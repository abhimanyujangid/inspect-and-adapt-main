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

      <div className="p-5">
        <div className="grid grid-cols-2 gap-5">
          {/* Config panel — maps to QGroupBox */}
          <section>
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">Training Configuration</div>
            <div className="border border-border bg-card p-4 rounded-sm">
              <div className="grid grid-cols-2 gap-3">
                <TrainingField label="Training Label">
                  <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={readOnly}
                    className="h-8 w-full rounded-sm border border-border bg-input px-2 text-[11px] text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </TrainingField>
                <TrainingField label="Datasets">
                  <select
                    value={datasetId}
                    onChange={(e) => setDatasetId(e.target.value)}
                    disabled={readOnly}
                    className="h-8 w-full rounded-sm border border-border bg-input px-2 text-[11px] text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  >
                    {datasets.length === 0 && <option value="">No datasets</option>}
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.images.length} Images)
                      </option>
                    ))}
                  </select>
                </TrainingField>
              </div>

              <div className="mt-3">
                <TrainingField label="Backbone">
                  <input
                    value={backbone}
                    placeholder="PatchCore"
                    onChange={(e) => setBackbone(e.target.value)}
                    disabled={readOnly}
                    className="h-8 w-full rounded-sm border border-border bg-input px-2 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                  />
                </TrainingField>
              </div>

              {!readOnly && (
                <button
                  onClick={trainModel}
                  disabled={training || !datasetId}
                  className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-sm bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 disabled:opacity-40"
                >
                  <Save className="h-3.5 w-3.5" /> Train Model
                </button>
              )}
            </div>
          </section>

          {/* Progress + logs — maps to QProgressBar + QTextEdit */}
          <section className="flex flex-col gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">Progress</div>
              <div className="border border-border bg-card p-4 rounded-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
                    {training ? "Training..." : progress >= 100 ? "Complete" : "Idle"}
                  </span>
                  <span className="font-mono-tabular text-[11px] font-bold text-foreground">{progress}%</span>
                </div>
                {/* Progress bar — maps to QProgressBar */}
                <div className="mt-2 h-2 w-full overflow-hidden bg-surface-2 rounded-sm">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">Activity Log</div>
              {/* Log area — maps to QTextEdit (readOnly) */}
              <div className="min-h-[300px] border border-border bg-[#111318] p-3 rounded-sm font-mono-tabular">
                <div className="flex flex-col gap-2">
                  {logs.length === 0 && (
                    <p className="text-[10px] text-muted-foreground">No activity yet.</p>
                  )}
                  {logs.map((l) => (
                    <div key={l} className="border-l-2 border-primary bg-surface px-3 py-2 text-[10px] text-foreground">
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

function TrainingField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
