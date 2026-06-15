import {
  LayoutDashboard, AlertTriangle, Cable, Camera, SlidersHorizontal,
  Database, Aperture, Images, Brain, Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PageKey =
  | "dashboard" | "alarm"
  | "plc" | "camera" | "device"
  | "datasets" | "capture" | "gallery" | "training" | "models";

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
    label: "Setup",
    items: [
      { key: "plc", label: "PLC Configuration", icon: Cable },
      { key: "camera", label: "Camera Configuration", icon: Camera },
      { key: "device", label: "Device Control", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Training",
    items: [
      { key: "datasets", label: "Datasets", icon: Database },
      { key: "capture", label: "Image Capture", icon: Aperture },
      { key: "gallery", label: "Gallery", icon: Images },
      { key: "training", label: "Model Training", icon: Brain },
      { key: "models", label: "Model Manager", icon: Boxes },
    ],
  },
];

export function Sidebar({ current, onNavigate }: { current: PageKey; onNavigate: (k: PageKey) => void }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {GROUPS.map((g) => (
          <div key={g.label} className="mb-6">
            <div className="px-3 pb-2 text-sm font-semibold text-foreground">
              {g.label}
            </div>
            <div className="flex flex-col gap-1">
              {g.items.map((it) => {
                const active = current === it.key;
                return (
                  <button
                    key={it.key}
                    onClick={() => onNavigate(it.key)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-primary" : "border border-muted-foreground/40"
                    )} />
                    <span className="flex-1 truncate">{it.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
