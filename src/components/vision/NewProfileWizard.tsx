import { useState } from "react";
import { X } from "lucide-react";
import { WIZARD_STEPS } from "@/lib/vision-wizard-steps";
import { createEmptyProfile, type Profile, type VisionStorage } from "@/lib/vision-storage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { ModelManagerPage } from "./pages/ModelManagerPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { ProfileInfoStep } from "./ProfileInfoStep";
import { WizardFooter } from "./WizardFooter";
import { WizardStepBar } from "./WizardStepBar";

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
  const last = step === WIZARD_STEPS.length - 1;

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
        onPersist({ ...storage, profiles: [...storage.profiles, newProfile] });
        onSetEditingId(newProfile.id);
      } else if (profile) {
        updateProfile({ ...profile, capName: name });
      }
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  };

  const pageProps = profile ? { profile, readOnly: false as const, onUpdate: updateProfile } : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Wizard header — maps to QToolBar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b-2 border-primary bg-[#e0e2e8] px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-[9px] font-black text-primary-foreground">
            {step + 1}
          </div>
          <div className="leading-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {mode === "edit" ? "Edit Profile" : "New Profile"} · Step {step + 1}/
              {WIZARD_STEPS.length}
            </span>
            <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-primary">
              {WIZARD_STEPS[step].label}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <WizardStepBar step={step} profileId={profileId} onStepChange={setStep} />

      <div className="flex-1 overflow-auto">
        {step === 0 && <ProfileInfoStep capName={capName} onCapNameChange={setCapName} />}
        {step === 1 && pageProps && <PlcConfigPage {...pageProps} />}
        {step === 2 && pageProps && <CameraConfigPage {...pageProps} />}
        {step === 3 && pageProps && <ImageCapturePage {...pageProps} />}
        {step === 4 && pageProps && <GalleryPage {...pageProps} />}
        {step === 5 && pageProps && <ModelTrainingPage {...pageProps} />}
        {step === 6 && pageProps && <ModelManagerPage {...pageProps} />}
      </div>

      <WizardFooter
        step={step}
        last={last}
        capName={capName}
        mode={mode}
        profileId={profileId}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onNext={handleNext}
        onFinish={() => profileId && onFinish(profileId)}
      />
    </div>
  );
}
