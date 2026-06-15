import { useState } from "react";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import { TrainedModelsPanel, type TrainedModel } from "./TrainedModelsPanel";
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
  onClose, onCreate, models,
}: { onClose: () => void; onCreate: (p: Profile) => void; models: TrainedModel[] }) {
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
        {step === 6 && (
          <TrainedModelsPanel
            defaultSelectedId="wizard-new"
            models={[
              ...models,
              {
                id: "wizard-new",
                name: `${capName} Model`,
                subtitle: "No IP set",
                dataset: capName.toLowerCase().replace(/\s+/g, "_"),
                capType: capName,
                images: "127",
                backbone: "PatchCore",
                threshold: "0.56",
              },
            ]}
          />
        )}
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
