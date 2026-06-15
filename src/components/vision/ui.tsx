import { cn } from "@/lib/utils";

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between border-b border-border bg-sidebar/40 px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title, action, children, className,
}: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("panel flex flex-col overflow-hidden", className)}>
      {title && (
        <header className="flex h-9 items-center justify-between border-b border-border px-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {title}
          </h3>
          {action}
        </header>
      )}
      <div className="flex-1 p-4">{children}</div>
    </section>
  );
}

export function Stat({ label, value, hint, tone = "default" }: {
  label: string; value: string; hint?: string; tone?: "default" | "success" | "warning" | "destructive" | "primary";
}) {
  const c = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
  }[tone];
  return (
    <div className="panel p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-mono-tabular text-2xl font-semibold", c)}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 rounded-md border border-border bg-input px-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
        props.className,
      )}
    />
  );
}

export function Select({ children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...rest}
      className={cn(
        "h-9 rounded-md border border-border bg-input px-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
        rest.className,
      )}
    >
      {children}
    </select>
  );
}

export function Btn({
  variant = "primary", className, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" | "danger" | "success" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border bg-surface hover:bg-surface-2",
    ghost: "hover:bg-surface-2 text-muted-foreground hover:text-foreground",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold transition",
        v, className,
      )}
    />
  );
}

export function Badge({ tone = "default", children }: { tone?: "default" | "success" | "warning" | "destructive" | "primary"; children: React.ReactNode }) {
  const c = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success ring-1 ring-success/30",
    warning: "bg-warning/15 text-warning ring-1 ring-warning/30",
    destructive: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
    primary: "bg-primary/15 text-primary ring-1 ring-primary/30",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", c)}>
      {children}
    </span>
  );
}
