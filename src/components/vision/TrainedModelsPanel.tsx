import { useState } from "react";
import { RefreshCw, Save, Trash2 } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { ConfirmModal } from "./ConfirmModal";
import type { Model, Profile, ProfilePageProps } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

type Props = ProfilePageProps & {
  defaultSelectedId?: string;
};

export function TrainedModelsPanel({
  profile,
  readOnly,
  onUpdate,
  defaultSelectedId,
}: Props) {
  const models = profile.models;
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? models[0]?.id ?? "");
  const [threshold, setThreshold] = useState(models[0]?.threshold ?? "0.56");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-[11px] text-muted-foreground">
        No trained models yet. Train a model in the Model Training step.
      </div>
    );
  }

  const selectModel = (id: string) => {
    setSelectedId(id);
    const model = models.find((m) => m.id === id);
    if (model) setThreshold(model.threshold);
  };

  const updateModels = (next: Model[]) => {
    onUpdate({ ...profile, models: next });
  };

  const activateModel = () => {
    updateModels(models.map((m) => ({ ...m, active: m.id === selected.id })));
  };

  const deactivateModel = () => {
    updateModels(models.map((m) => (m.id === selected.id ? { ...m, active: false } : m)));
  };

  const deleteModel = () => {
    if (!deleteId) return;
    const next = models.filter((m) => m.id !== deleteId);
    updateModels(next);
    if (selectedId === deleteId) {
      setSelectedId(next[0]?.id ?? "");
      setThreshold(next[0]?.threshold ?? "0.56");
    }
    setDeleteId(null);
  };

  const saveThreshold = () => {
    updateModels(models.map((m) => (m.id === selected.id ? { ...m, threshold } : m)));
  };

  const dataset = profile.datasets.find((d) => d.id === selected.datasetId);

  return (
    <>
      <div className="flex h-full min-h-0">
        {/* Model list — maps to QListWidget */}
        <aside className="w-48 shrink-0 border-r border-border bg-sidebar p-2">
          <div className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">Trained Models</div>
          <div className="flex flex-col gap-1">
            {models.map((model) => {
              const active = model.id === selectedId;
              return (
                <button
                  key={model.id}
                  onClick={() => selectModel(model.id)}
                  className={cn(
                    "rounded-sm px-3 py-2 text-left",
                    active
                      ? "border-l-2 border-primary bg-primary/10 text-primary"
                      : "border-l-2 border-transparent text-foreground hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold">{model.name}</span>
                    {model.active && (
                      <span className="rounded-sm bg-success/20 border border-success/40 px-1 py-0.5 text-[7px] font-black uppercase text-success">
                        Active
                      </span>
                    )}
                  </div>
                  <div className={cn("mt-0.5 text-[9px] font-bold", active ? "text-primary/60" : "text-muted-foreground")}>
                    {dataset?.name ?? "Unknown dataset"}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Model detail — maps to QFormLayout */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
          <ModelSection title={selected.name}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <InfoItem label="Dataset" value={dataset?.name ?? "—"} />
              <InfoItem label="Cap Type" value={profile.capName} />
              <InfoItem label="Training Images" value={String(dataset?.images.length ?? 0)} />
              <InfoItem label="Status" value={selected.status} />
            </div>
            {!readOnly && (
              <div className="mt-4 flex justify-end gap-2">
                {selected.active ? (
                  <Btn variant="outline" onClick={deactivateModel}>Deactivate</Btn>
                ) : (
                  <Btn variant="success" onClick={activateModel}>
                    <RefreshCw className="h-3 w-3" />
                    Activate Model
                  </Btn>
                )}
                <Btn variant="danger" className="px-2" onClick={() => setDeleteId(selected.id)}>
                  <Trash2 className="h-3 w-3" />
                </Btn>
              </div>
            )}
          </ModelSection>

          <ModelSection title="Reject Threshold">
            <p className="text-[10px] text-muted-foreground">
              Lower = more sensitive, more rejections. Higher = less sensitive, may miss defects.
            </p>
            <div className="mt-3">
              <Field label="Threshold Value">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  disabled={readOnly}
                />
              </Field>
              <div className="mt-1.5 flex justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>More Sensitive: 0.00</span>
                <span>Less Sensitive: 1.00</span>
              </div>
            </div>
            {!readOnly && (
              <Btn className="mt-4 h-8 w-full" onClick={saveThreshold}>
                <Save className="h-3 w-3" />
                Save Threshold
              </Btn>
            )}
          </ModelSection>
        </div>
      </div>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete Model"
        message="Are you sure you want to delete this model?"
        confirmLabel="Delete"
        danger
        onConfirm={deleteModel}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

function ModelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card rounded-sm">
      <header className="border-b-2 border-primary bg-surface-2 px-4 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono-tabular text-[12px] font-bold text-foreground">{value}</div>
    </div>
  );
}
