export function ConfigSectionPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-border bg-card">
      <header className="border-b-2 border-primary bg-surface-2 px-4 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
