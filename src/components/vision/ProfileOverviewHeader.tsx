import type { Profile } from "@/lib/vision-storage";
import { Badge } from "./ui";

export function ProfileOverviewHeader({ profile }: { profile: Profile }) {
  return (
    <div className="shrink-0 border-b-2 border-primary bg-surface px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-primary-foreground">
            P
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-primary">
              {profile.capName}
            </h1>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Active Profile · Created{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <Badge tone="success">● ACTIVE</Badge>
      </div>
    </div>
  );
}
