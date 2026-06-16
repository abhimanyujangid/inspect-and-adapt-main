import { useState } from "react";
import { X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import { TrainedModelsPanel } from "./TrainedModelsPanel";
import {
  createEmptyProfile,
  type Profile,
  type VisionStorage,
} from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "info", label: "Profile Info" },
  { key: "plc", label: "PLC" },
  { key: "camera", label: "Camera" },
  { key: "capture", label: "Image Capture" },
  { key: "gallery", label: "Gallery" },
  { key: "training", label: "Model Training" },
  { key: "done", label: "Model Manager" },
] as const;

type Props = {
  mode: "create" | "edit";
  editingProfile: Profile | null;
  storage: VisionStorage;
  onClose: () => void;
  onPersist: (storage: VisionStorage) => void;
  onSetEditingId: (id: string) => void;
  onFinish: (profileId: string) => void;
};

export function NewProfileWizard({
  mode,
  editingProfile,
  storage,
  onClose,
  onPersist,
  onSetEditingId,
  onFinish,
}: Props) {
  const [step, setStep] = useState(0);
  const [capName, setCapName] = useState(editingProfile?.capName ?? "");

  const profileId = editingProfile?.id ?? null;
  const profile = storage.profiles.find((p) => p.id === profileId) ?? editingProfile;

  const last = step === STEPS.length - 1;

  const updateProfile = (updated: Profile) => {
    onPersist({
      ...storage,
      profiles: storage.profiles.map((p) => (p.id === updated.id ? updated : p)),
    });
  };

  const handleNext = () => {
    if (step === 0) {
      const name = capName.trim();
      if (!name) return;

      if (mode === "create" && !profileId) {
        const newProfile = createEmptyProfile(name);
        onPersist({
          ...storage,
          profiles: [...storage.profiles, newProfile],
        });
        onSetEditingId(newProfile.id);
      } else if (profile) {
        updateProfile({ ...profile, capName: name });
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleFinish = () => {
    if (profileId) onFinish(profileId);
  };

  const pageProps = profile
    ? { profile, readOnly: false as const, onUpdate: updateProfile }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Wizard header — maps to QToolBar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b-2 border-primary bg-[#14171c] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-[9px] font-black text-primary-foreground">
            {step + 1}
          </div>
          <div className="leading-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {mode === "edit" ? "Edit Profile" : "New Profile"} · Step {step + 1}/{STEPS.length}
            </span>
            <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              {STEPS[step].label}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Step indicator — maps to QTabBar / custom step widget */}
      <div className="flex shrink-0 items-center gap-1 border-b border-border bg-surface px-4 py-2 overflow-x-auto">
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => profileId && setStep(i)}
            disabled={!profileId && i > 0}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1 text-[9px] font-bold uppercase tracking-wider",
              i === step ? "border-primary bg-primary/15 text-primary"
                : i < step ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-surface text-muted-foreground",
              !profileId && i > 0 && "opacity-30",
            )}
          >
            <span className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm text-[8px] font-black",
              i === step ? "bg-primary text-primary-foreground"
                : i < step ? "bg-success text-success-foreground"
                : "bg-surface-2 text-muted-foreground",
            )}>
              {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-auto">
        {step === 0 && (
          <div className="mx-auto max-w-2xl p-6">
            <div className="border border-border bg-card p-5 rounded-sm">
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">Profile Information</h2>
              <div className="space-y-3">
                <Field label="Cap Name">
                  <Input value={capName} onChange={(e) => setCapName(e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        )}
        {step === 1 && pageProps && <PlcConfigPage {...pageProps} />}
        {step === 2 && pageProps && <CameraConfigPage {...pageProps} />}
        {step === 3 && pageProps && <ImageCapturePage {...pageProps} />}
        {step === 4 && pageProps && <GalleryPage {...pageProps} />}
        {step === 5 && pageProps && <ModelTrainingPage {...pageProps} />}
        {step === 6 && pageProps && <TrainedModelsPanel {...pageProps} />}
      </div>

      {/* Footer toolbar — maps to QDialogButtonBox */}
      <div className="flex h-10 shrink-0 items-center justify-between border-t border-border bg-[#14171c] px-4">
        <Btn variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          <ChevronLeft className="h-3 w-3" /> Back
        </Btn>
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {mode === "edit" ? "Editing" : "New profile"} ·{" "}
          <span className="text-foreground">{capName || "—"}</span>
        </div>
        {last ? (
          <Btn variant="success" onClick={handleFinish} disabled={!profileId}>
            <Check className="h-3 w-3" /> Finish
          </Btn>
        ) : (
          <Btn onClick={handleNext} disabled={step === 0 && !capName.trim()}>
            Next <ChevronRight className="h-3 w-3" />
          </Btn>
        )}
      </div>
    </div>
  );
}
