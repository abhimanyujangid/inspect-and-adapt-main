import { Boxes } from "lucide-react";

export function ProfileEmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-12">
      <div className="text-center">
        <Boxes className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
          No Active Profile
        </h2>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Create or activate a profile to view its configuration.
        </p>
      </div>
    </div>
  );
}
