import { Plus, Settings2, Activity } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import type { UserRole } from "@/lib/vision-constants";
import { LineControlButtons } from "./LineControlButtons";
import { RoleToggle } from "./RoleToggle";

type Props = {
  activeProfile: Profile | null;
  onNewProfile: () => void;
  onManageProfiles: () => void;
  role: UserRole;
  onRequestRoleChange: (role: UserRole) => void;
  lineRunning: boolean;
  onToggleLine: () => void;
};

export function TopBar({
  activeProfile,
  onNewProfile,
  onManageProfiles,
  role,
  onRequestRoleChange,
  lineRunning,
  onToggleLine,
}: Props) {
  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-[#e0e2e8] px-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-primary-foreground">
          BV
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
            BaiTech Vision
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            Bottle Cap Inspection System
          </span>
        </div>
      </div>

      <div className="mx-1 h-6 w-px bg-border" />

      <LineControlButtons lineRunning={lineRunning} onToggleLine={onToggleLine} />

      <button className="flex h-7 items-center gap-1.5 rounded-sm border border-success/50 bg-success/15 px-3 text-[10px] font-bold uppercase tracking-wider text-success">
        <span className="h-2 w-2 rounded-full bg-success" />
        No Alarms
      </button>

      <div className="flex items-center gap-1.5 px-2">
        <Activity className="h-3 w-3 text-success" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-success">ONLINE</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Profile:
        </span>
        <span className="flex h-7 min-w-[180px] items-center rounded-sm border border-border bg-surface px-2 font-mono-tabular text-[11px] font-bold text-foreground">
          {activeProfile?.capName ?? "— NONE —"}
        </span>
      </div>

      {role === "Admin" && (
        <>
          <button
            onClick={onNewProfile}
            className="flex h-7 items-center gap-1.5 rounded-sm bg-primary px-3 text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
          >
            <Plus className="h-3 w-3" /> New Profile
          </button>
          <button
            onClick={onManageProfiles}
            className="flex h-7 items-center gap-1.5 rounded-sm border border-border bg-surface px-3 text-[10px] font-bold uppercase tracking-wider text-foreground hover:bg-surface-2"
          >
            <Settings2 className="h-3 w-3" /> Manage
          </button>
        </>
      )}

      <div className="ml-1 h-6 w-px bg-border" />
      <RoleToggle role={role} onRequestRoleChange={onRequestRoleChange} />
    </header>
  );
}
