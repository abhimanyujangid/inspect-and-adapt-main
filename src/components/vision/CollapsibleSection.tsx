import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export function CollapsibleSection({
  icon: Icon,
  title,
  count,
  defaultOpen = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-sm border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 bg-surface-2 px-4 py-2.5 text-left hover:bg-surface"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="flex-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
          {title}
        </span>
        {count !== undefined && (
          <span className="font-mono-tabular text-[11px] font-bold text-muted-foreground">
            [{count}]
          </span>
        )}
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open && <div className="border-t border-border p-4">{children}</div>}
    </section>
  );
}

export function SectionEmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-[11px] text-muted-foreground">{children}</p>;
}
