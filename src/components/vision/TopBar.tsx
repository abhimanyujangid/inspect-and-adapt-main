import { Plus, Settings2, Square, Activity } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";

type Props = {
  activeProfile: Profile | null;
  onNewProfile: () => void;
  onManageProfiles: () => void;
  role: "Admin" | "Operator";
  onToggleRole: () => void;
};

export function TopBar({
  activeProfile,
  onNewProfile,
  onManageProfiles,
  role,
  onToggleRole,
}: Props) {
  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-[#14171c] px-3">
      {/* Logo / system identity */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-primary-foreground">
          BV
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">BaiTech Vision</span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Bottle Cap Inspection System</span>
        </div>
      </div>

      <div className="mx-1 h-6 w-px bg-border" />

      {/* System controls */}
      <button className="flex h-7 items-center gap-1.5 rounded-sm border border-destructive/50 bg-destructive/15 px-3 text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/25">
        <Square className="h-2.5 w-2.5 fill-current" /> STOP
      </button>
      <button className="flex h-7 items-center gap-1.5 rounded-sm border border-success/50 bg-success/15 px-3 text-[10px] font-bold uppercase tracking-wider text-success">
        <span className="h-2 w-2 rounded-full bg-success" />
        No Alarms
      </button>

      {/* System status indicator */}
      <div className="flex items-center gap-1.5 px-2">
        <Activity className="h-3 w-3 text-success" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-success">ONLINE</span>
      </div>

      <div className="flex-1" />

      {/* Active profile display */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Profile:</span>
        <span className="flex h-7 min-w-[180px] items-center rounded-sm border border-border bg-surface px-2 text-[11px] font-bold text-foreground font-mono-tabular">
          {activeProfile?.capName ?? "— NONE —"}
        </span>
      </div>

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

      <div className="ml-1 h-6 w-px bg-border" />

      {/* Role toggle — maps to QButtonGroup in PySide6 */}
      <div className="flex items-center gap-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Role:</span>
        <div className="flex h-7 rounded-sm border border-border bg-surface">
          <button
            onClick={() => role !== "Admin" && onToggleRole()}
            className={`rounded-sm px-3 text-[10px] font-bold uppercase tracking-wider ${
              role === "Admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => role !== "Operator" && onToggleRole()}
            className={`rounded-sm px-3 text-[10px] font-bold uppercase tracking-wider ${
              role === "Operator" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Operator
          </button>
        </div>
      </div>
    </header>
  );
}
