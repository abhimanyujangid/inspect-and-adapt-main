import { Check } from "lucide-react";
import { WIZARD_STEPS } from "@/lib/vision-wizard-steps";
import { cn } from "@/lib/utils";

export function WizardStepBar({
  step,
  profileId,
  onStepChange,
}: {
  step: number;
  profileId: string | null;
  onStepChange: (step: number) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-surface px-4 py-2">
      {WIZARD_STEPS.map((s, i) => (
        <button
          key={s.key}
          onClick={() => profileId && onStepChange(i)}
          disabled={!profileId && i > 0}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-sm border px-2 py-1 text-[9px] font-bold uppercase tracking-wider",
            i === step
              ? "border-primary bg-primary/15 text-primary"
              : i < step
                ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-surface text-muted-foreground",
            !profileId && i > 0 && "opacity-30",
          )}
        >
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-sm text-[8px] font-black",
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                  ? "bg-success text-success-foreground"
                  : "bg-surface-2 text-muted-foreground",
            )}
          >
            {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
          </span>
          {s.label}
        </button>
      ))}
    </div>
  );
}
