import { cn } from "@/lib/utils";

/**
 * Industrial UI primitives — flat, no shadow, no transitions.
 * Maps 1:1 to PySide6 QSS-styled widgets:
 *   PageHeader  → QFrame with QLabel
 *   Panel       → QGroupBox
 *   Stat        → QFrame + QLabel
 *   Field       → QLabel + child widget
 *   Input       → QLineEdit
 *   Select      → QComboBox
 *   Btn         → QPushButton
 *   Badge       → QLabel with colored background
 */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="shrink-0 flex items-end justify-between border-b-2 border-primary bg-surface px-5 py-3">
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-primary">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel flex flex-col overflow-hidden", className)}>
      {title && (
        <header className="flex h-8 items-center justify-between border-b border-border px-3 bg-surface-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            {title}
          </h3>
          {action}
        </header>
      )}
      <div className="flex-1 p-3">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "destructive" | "primary";
}) {
  const c = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    primary: "text-primary",
  }[tone];
  return (
    <div className="panel p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={cn("mt-1 font-mono-tabular text-2xl font-bold", c)}>{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-8 rounded-sm border border-border bg-input px-2 text-sm font-mono-tabular text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
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
        "h-8 rounded-sm border border-border bg-input px-2 text-sm text-foreground focus:border-primary focus:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        rest.className,
      )}
    >
      {children}
    </select>
  );
}

export function Btn({
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "danger" | "success";
}) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:brightness-110",
    success: "bg-success text-success-foreground hover:brightness-110",
    danger: "bg-destructive text-destructive-foreground hover:brightness-110",
    outline: "border border-border bg-surface text-foreground hover:bg-surface-2",
    ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  }[variant];
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-1.5 rounded-sm px-3 text-[11px] font-bold uppercase tracking-wider",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        v,
        className,
      )}
    />
  );
}

export function Badge({
  tone = "default",
  children,
}: {
  tone?: "default" | "success" | "warning" | "destructive" | "primary";
  children: React.ReactNode;
}) {
  const c = {
    default: "bg-surface-2 text-muted-foreground border-border",
    success: "bg-success/20 text-success border-success/40",
    warning: "bg-warning/20 text-warning border-warning/40",
    destructive: "bg-destructive/20 text-destructive border-destructive/40",
    primary: "bg-primary/20 text-primary border-primary/40",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        c,
      )}
    >
      {children}
    </span>
  );
}
