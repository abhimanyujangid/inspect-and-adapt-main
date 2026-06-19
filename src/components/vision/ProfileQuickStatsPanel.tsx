import { Brain, Cable, Camera, Images } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { getActivePlcConfigurations } from "@/lib/vision-storage";

function QuickStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-border bg-card p-3">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <div className="font-mono-tabular text-lg font-bold text-foreground">{value}</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {hint && <div className="text-[8px] text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}

export function ProfileQuickStatsPanel({ profile }: { profile: Profile }) {
  const activePlcs = getActivePlcConfigurations(profile.plcConfigurations);
  const totalPlcs = profile.plcConfigurations.length;

  return (
    <div className="grid grid-cols-4 gap-2">
      <QuickStat
        label="PLC Configs"
        value={String(activePlcs.length)}
        hint={totalPlcs > 0 ? `of ${totalPlcs} total` : undefined}
        icon={Cable}
      />
      <QuickStat
        label="Camera"
        value={profile.cameraConfiguration.cameraName.split(" ").slice(-1)[0]}
        icon={Camera}
      />
      <QuickStat label="Datasets" value={String(profile.datasets.length)} icon={Images} />
      <QuickStat label="Models" value={String(profile.models.length)} icon={Brain} />
    </div>
  );
}
