import { ChevronDown, Plus, Settings2, Square } from "lucide-react";
import { useState } from "react";
import type { Profile } from "./VisionApp";
import { cn } from "@/lib/utils";

type Props = {
  profiles: Profile[];
  activeProfile: Profile;
  onSelectProfile: (id: string) => void;
  onNewProfile: () => void;
  onManageProfiles: () => void;
  role: "Admin" | "Operator";
  onToggleRole: () => void;
};

export function TopBar({
  profiles, activeProfile, onSelectProfile,
  onNewProfile, onManageProfiles, role, onToggleRole,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-sidebar px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          BV
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-foreground">BaiTech Vision</span>
          <span className="text-xs text-muted-foreground">Bottle Cap Inspection</span>
        </div>
      </div>

      <div className="mx-2 h-8 w-px bg-border" />

      <button className="flex h-9 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-xs font-bold tracking-wider text-foreground hover:bg-surface-2">
        <Square className="h-3 w-3 fill-current" /> STOP
      </button>
      <button className="flex h-9 items-center rounded-md bg-success px-4 text-sm font-semibold text-success-foreground hover:bg-success/90">
        No Alarms
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Profile:</span>
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 min-w-[200px] items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            <span>{activeProfile.name}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-12 z-20 w-64 rounded-md border border-border bg-popover py-1 shadow-lg">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onSelectProfile(p.id); setOpen(false); }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent",
                      p.id === activeProfile.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">{p.product}</span>
                    </span>
                    <StatusDot status={p.status} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onNewProfile}
        className="flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" /> New Profile
      </button>

      <button
        onClick={onManageProfiles}
        className="flex h-10 items-center gap-1.5 rounded-md border border-border bg-surface px-4 text-sm font-medium hover:bg-surface-2"
      >
        <Settings2 className="h-4 w-4" /> Manage Profiles
      </button>

      <div className="ml-2 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">View As:</span>
        <div className="flex h-10 rounded-md border border-border bg-surface p-0.5">
          <button
            onClick={() => role !== "Admin" && onToggleRole()}
            className={cn(
              "rounded px-4 text-sm font-semibold transition",
              role === "Admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Admin
          </button>
          <button
            onClick={() => role !== "Operator" && onToggleRole()}
            className={cn(
              "rounded px-4 text-sm font-semibold transition",
              role === "Operator" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Operator
          </button>
        </div>
      </div>
    </header>
  );
}

function StatusDot({ status }: { status: Profile["status"] }) {
  const c = {
    Ready: "text-success",
    Training: "text-primary",
    Incomplete: "text-warning",
    Error: "text-destructive",
  }[status];
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
      <span className={cn("led", c)} />
      {status}
    </span>
  );
}
