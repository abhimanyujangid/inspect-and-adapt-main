import { LayoutDashboard, AlertTriangle, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type PageKey = "dashboard" | "alarm" | "profile";

type Group = {
  label: string;
  items: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[];
};

const GROUPS: Group[] = [
  {
    label: "Inspection",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "alarm", label: "Alarm", icon: AlertTriangle },
    ],
  },
  {
    label: "Configuration",
    items: [{ key: "profile", label: "Profile Overview", icon: UserCircle }],
  },
];

export function Sidebar({
  current,
  onNavigate,
}: {
  current: PageKey;
  onNavigate: (k: PageKey) => void;
}) {
  return (
    <aside className="flex w-52 shrink-0 flex-col border-r border-border bg-sidebar">
      <nav className="flex-1 overflow-y-auto py-3">
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-4">
            {/* Group label — maps to QLabel in PySide6 */}
            <div className="px-4 pb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {g.label}
            </div>
            <div className="flex flex-col">
              {g.items.map((it) => {
                const active = current === it.key;
                return (
                  <button
                    key={it.key}
                    onClick={() => onNavigate(it.key)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2 text-left text-[11px] font-bold uppercase tracking-wider",
                      active
                        ? "border-l-2 border-primary bg-sidebar-accent text-primary"
                        : "border-l-2 border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    <it.icon
                      className={cn(
                        "h-3.5 w-3.5",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span className="flex-1 truncate">{it.label}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer status strip — maps to QStatusBar */}
      <div className="border-t border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            System Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
