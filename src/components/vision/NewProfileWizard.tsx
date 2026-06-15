import { useState } from "react";
import { X, Check, ChevronLeft, ChevronRight, RefreshCw, Save } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import type { Profile } from "./VisionApp";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "info", label: "Profile Info" },
  { key: "plc", label: "PLC" },
  { key: "camera", label: "Camera" },
  { key: "capture", label: "Image Capture" },
  { key: "gallery", label: "Gallery" },
  { key: "training", label: "Model Training" },
  { key: "done", label: "Model Ready" },
] as const;

export function NewProfileWizard({
  onClose, onCreate,
}: { onClose: () => void; onCreate: (p: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [capName, setCapName] = useState("Bottle Cap V3");

  const last = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Wizard header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-sidebar px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/40 text-primary text-sm font-semibold">
            {step + 1}
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">New Profile · Step {step + 1} of {STEPS.length}</div>
            <div className="text-sm font-semibold">{STEPS[step].label}</div>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Stepper */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-sidebar/50 px-4 py-3 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setStep(i)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] font-medium transition",
              i === step ? "border-primary bg-primary/10 text-primary"
                : i < step ? "border-border bg-success/10 text-success"
                : "border-border bg-surface text-muted-foreground",
            )}
          >
            <span className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
              i === step ? "bg-primary text-primary-foreground"
                : i < step ? "bg-success text-success-foreground"
                : "bg-input text-muted-foreground",
            )}>
              {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
            </span>
            {s.label}
            {i < STEPS.length - 1 && <ChevronRight className="ml-0.5 h-3 w-3 text-muted-foreground/60" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {step === 0 && (
          <div className="mx-auto max-w-2xl p-8">
            <div className="panel p-6">
              <h2 className="mb-4 text-base font-semibold">Profile Information</h2>
              <div className="space-y-4">
                <Field label="Cap Name">
                  <Input value={capName} onChange={(e) => setCapName(e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        )}
        {step === 1 && <PlcConfigPage />}
        {step === 2 && <CameraConfigPage />}
        {step === 3 && <ImageCapturePage />}
        {step === 4 && <GalleryPage />}
        {step === 5 && <ModelTrainingPage />}
        {step === 6 && <ReadySummary capName={capName} />}
      </div>

      {/* Footer */}
      <div className="flex h-16 shrink-0 items-center justify-between border-t border-border bg-sidebar px-6">
        <Btn variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </Btn>
        <div className="text-xs text-muted-foreground">
          New profile · <span className="text-foreground font-medium">{capName}</span>
        </div>
        {last ? (
          <div className="flex gap-2">
            <Btn variant="outline">Save Profile</Btn>
            <Btn variant="success" onClick={() => onCreate({
              id: `p${Date.now()}`, name: capName, product: capName, status: "Ready",
              created: new Date().toISOString().slice(0, 10),
              modified: new Date().toISOString().slice(0, 10),
            })}>
              <Check className="h-3.5 w-3.5" /> Activate & Finish
            </Btn>
          </div>
        ) : (
          <Btn onClick={() => setStep((s) => s + 1)}>
            {step === 5 ? "Train" : "Next"} <ChevronRight className="h-3.5 w-3.5" />
          </Btn>
        )}
      </div>
    </div>
  );
}

function ReadySummary({ capName }: { capName: string }) {
  const [selectedId, setSelectedId] = useState("m1");
  const [threshold, setThreshold] = useState("0.56");

  const models = [
    {
      id: "m1",
      name: "Model Name 1",
      subtitle: "No IP set",
      dataset: "crown_cap_v1",
      capType: capName || "Crown Cap 26mm",
      images: "127",
      backbone: "PatchCore",
    },
    {
      id: "m2",
      name: "Model Name 2",
      subtitle: "No IP set",
      dataset: "crown_cap_v2",
      capType: "Crown Cap 28mm",
      images: "96",
      backbone: "PatchCore",
    },
    {
      id: "m3",
      name: "Factory Floor A",
      subtitle: "192.168.0.10",
      dataset: "factory_floor_a",
      capType: "Blue Cap",
      images: "210",
      backbone: "ResNet50",
    },
    {
      id: "m4",
      name: "Test Batch",
      subtitle: "10.0.0.50",
      dataset: "test_batch",
      capType: "Red Cap",
      images: "64",
      backbone: "EfficientNet",
    },
  ];

  const selected = models.find((m) => m.id === selectedId) ?? models[0];

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
                onClick={() => setSelectedId(model.id)}
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
        <ReadySection title={selected.name}>
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
        </ReadySection>

        <ReadySection title="Reject Threshold">
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
          <button className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-foreground text-sm font-semibold text-background transition hover:bg-foreground/90">
            <Save className="h-4 w-4" />
            Save Threshold
          </button>
        </ReadySection>
      </div>
    </div>
  );
}

function ReadySection({
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
