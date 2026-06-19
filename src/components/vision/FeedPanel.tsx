import { cn } from "@/lib/utils";

function CornerBrackets({ color }: { color: string }) {
  const s = `absolute h-4 w-4 ${color}`;
  return (
    <>
      <span className={cn(s, "top-2 left-2 border-t-2 border-l-2")} />
      <span className={cn(s, "top-2 right-2 border-t-2 border-r-2")} />
      <span className={cn(s, "bottom-2 left-2 border-b-2 border-l-2")} />
      <span className={cn(s, "bottom-2 right-2 border-b-2 border-r-2")} />
    </>
  );
}

export function FeedPanel({
  title,
  action,
  accent,
  placeholder,
  subtext,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  accent: "primary" | "warning";
  placeholder?: string;
  subtext?: string;
  children?: React.ReactNode;
}) {
  const cornerColor = accent === "primary" ? "border-primary" : "border-warning";
  return (
    <section className="panel flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-8 shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{title}</h3>
        {action}
      </header>
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#e8eaee] grid-bg">
        <CornerBrackets color={cornerColor} />
        {children ?? (
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {placeholder}
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">{subtext}</div>
          </div>
        )}
      </div>
    </section>
  );
}
