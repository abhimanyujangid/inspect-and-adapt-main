export function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 font-mono-tabular text-[12px] font-bold text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}
