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
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
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
        <aside className="w-56 shrink-0 border-r border-border bg-sidebar/30 p-3">
          <div className="mb-3 px-2 text-sm font-semibold text-foreground">Trained Models</div>
          <div className="flex flex-col gap-1">
            {models.map((model) => {
              const active = model.id === selectedId;
              return (
                <button
                  key={model.id}
                  onClick={() => selectModel(model.id)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-left transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{model.name}</span>
                    {model.active && (
                      <span className="rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-success">
                        Active
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      "mt-0.5 text-xs",
                      active ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {dataset?.name ?? "Unknown dataset"}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
          <ModelSection title={selected.name}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <InfoItem label="Dataset" value={dataset?.name ?? "—"} />
              <InfoItem label="Cap Type" value={profile.capName} />
              <InfoItem label="Training Images" value={String(dataset?.images.length ?? 0)} />
              <InfoItem label="Status" value={selected.status} />
            </div>
            {!readOnly && (
              <div className="mt-5 flex justify-end gap-2">
                {selected.active ? (
                  <Btn variant="outline" onClick={deactivateModel}>Deactivate</Btn>
                ) : (
                  <Btn variant="success" onClick={activateModel}>
                    <RefreshCw className="h-3.5 w-3.5" />
                    Activate Model
                  </Btn>
                )}
                <Btn variant="danger" className="px-2.5" onClick={() => setDeleteId(selected.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Btn>
              </div>
            )}
          </ModelSection>

          <ModelSection title="Reject Threshold">
            <p className="text-sm text-muted-foreground">
              Lower = more sensitive, more rejections. Higher = less sensitive, may miss defects.
            </p>
            <div className="mt-4">
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
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>More Sensitive: 0.00</span>
                <span>Less Sensitive: 1.00</span>
              </div>
            </div>
            {!readOnly && (
              <Btn className="mt-5 h-10 w-full" onClick={saveThreshold}>
                <Save className="h-4 w-4" />
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
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
