import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Btn } from "./ui";

export function WizardFooter({
  step,
  last,
  capName,
  mode,
  profileId,
  onBack,
  onNext,
  onFinish,
}: {
  step: number;
  last: boolean;
  capName: string;
  mode: "create" | "edit";
  profileId: string | null;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between border-t border-border bg-[#e0e2e8] px-4">
      <Btn variant="outline" onClick={onBack} disabled={step === 0}>
        <ChevronLeft className="h-3 w-3" /> Back
      </Btn>
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {mode === "edit" ? "Editing" : "New profile"} ·{" "}
        <span className="text-foreground">{capName || "—"}</span>
      </div>
      {last ? (
        <Btn variant="success" onClick={onFinish} disabled={!profileId}>
          <Check className="h-3 w-3" /> Finish
        </Btn>
      ) : (
        <Btn onClick={onNext} disabled={step === 0 && !capName.trim()}>
          Next <ChevronRight className="h-3 w-3" />
        </Btn>
      )}
    </div>
  );
}
