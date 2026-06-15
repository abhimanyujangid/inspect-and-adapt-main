import { useState } from "react";
import { RefreshCw, Save } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { cn } from "@/lib/utils";

export type TrainedModel = {
  id: string;
  name: string;
  subtitle: string;
  dataset: string;
  capType: string;
  images: string;
  backbone: string;
  threshold: string;
};

export const SEED_MODELS: TrainedModel[] = [
  {
    id: "m1",
    name: "Model Name 1",
    subtitle: "No IP set",
    dataset: "crown_cap_v1",
    capType: "Crown Cap 26mm",
    images: "127",
    backbone: "PatchCore",
    threshold: "0.56",
  },
  {
    id: "m2",
    name: "Model Name 2",
    subtitle: "No IP set",
    dataset: "crown_cap_v2",
    capType: "Crown Cap 28mm",
    images: "96",
    backbone: "PatchCore",
    threshold: "0.56",
  },
  {
    id: "m3",
    name: "Factory Floor A",
    subtitle: "192.168.0.10",
    dataset: "factory_floor_a",
    capType: "Blue Cap",
    images: "210",
    backbone: "ResNet50",
    threshold: "0.56",
  },
  {
    id: "m4",
    name: "Test Batch",
    subtitle: "10.0.0.50",
    dataset: "test_batch",
    capType: "Red Cap",
    images: "64",
    backbone: "EfficientNet",
    threshold: "0.56",
  },
];

export function TrainedModelsPanel({
  models,
  onSaveThreshold,
  defaultSelectedId,
}: {
  models: TrainedModel[];
  onSaveThreshold?: (id: string, threshold: string) => void;
  defaultSelectedId?: string;
}) {
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? models[0]?.id ?? "");
  const [threshold, setThreshold] = useState(models[0]?.threshold ?? "0.56");

  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  if (!selected) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
        No trained models yet. Complete a profile to create one.
      </div>
    );
  }

  const selectModel = (id: string) => {
    setSelectedId(id);
    const model = models.find((m) => m.id === id);
    if (model) setThreshold(model.threshold);
  };

  return (
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
                <div className="text-sm font-semibold">{model.name}</div>
                <div
                  className={cn(
                    "mt-0.5 text-xs",
                    active ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}
                >
                  {model.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
        <ModelSection title={selected.name}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <InfoItem label="Dataset" value={selected.dataset} />
            <InfoItem label="Cap Type" value={selected.capType} />
            <InfoItem label="Training Images" value={selected.images} />
            <InfoItem label="Backbone" value={selected.backbone} />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Btn variant="success">
              <RefreshCw className="h-3.5 w-3.5" />
              Activate
            </Btn>
            <Btn variant="danger" className="px-2.5">
              <Save className="h-3.5 w-3.5" />
            </Btn>
          </div>
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
              />
            </Field>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>More Sensitive: 0.00</span>
              <span>Less Sensitive: 1.00</span>
            </div>
          </div>
          <Btn
            className="mt-5 h-10 w-full"
            onClick={() => onSaveThreshold?.(selected.id, threshold)}
          >
            <Save className="h-4 w-4" />
            Save Threshold
          </Btn>
        </ModelSection>
      </div>
    </div>
  );
}

function ModelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
