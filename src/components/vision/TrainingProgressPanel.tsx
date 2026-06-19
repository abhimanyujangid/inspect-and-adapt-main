export function TrainingProgressPanel({
  progress,
  training,
  logs,
}: {
  progress: number;
  training: boolean;
  logs: string[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          Progress
        </div>
        <div className="rounded-sm border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
              {training ? "Training..." : progress >= 100 ? "Complete" : "Idle"}
            </span>
            <span className="font-mono-tabular text-[11px] font-bold text-foreground">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-surface-2">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          Activity Log
        </div>
        <div className="min-h-[300px] rounded-sm border border-border bg-[#e8eaee] p-3 font-mono-tabular">
          <div className="flex flex-col gap-2">
            {logs.length === 0 && (
              <p className="text-[10px] text-muted-foreground">No activity yet.</p>
            )}
            {logs.map((l) => (
              <div
                key={l}
                className="border-l-2 border-primary bg-surface px-3 py-2 text-[10px] text-foreground"
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
