import { useState } from "react";
import type { Profile } from "@/lib/vision-storage";
import type { OutputViewMode } from "@/lib/vision-mock-data";
import { DashboardStatusBar } from "../DashboardStatusBar";
import { DashboardStatsPanel } from "../DashboardStatsPanel";
import { FeedPanel } from "../FeedPanel";
import { OutputHistoryPanel } from "../OutputHistoryPanel";
import { OutputViewToggle } from "../OutputViewToggle";
import { Badge } from "../ui";

export function DashboardPage({ profile }: { profile: Profile | null }) {
  const [outputViewMode, setOutputViewMode] = useState<OutputViewMode>("current");

  const cameraName = profile?.cameraConfiguration.cameraName ?? "Basler acA2440-35um";
  const fps = profile?.cameraConfiguration.fps ?? "24";
  const modelVersion =
    profile?.models.find((m) => m.active)?.name ?? profile?.models[0]?.name ?? "v2.4";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <DashboardStatusBar profile={profile} modelVersion={modelVersion} fps={fps} />

      <div className="flex min-h-0 flex-1 gap-3 p-3">
        <FeedPanel
          title="Camera Feed"
          action={
            <Badge tone="primary">
              <span className="font-mono-tabular">
                {cameraName} · {fps} FPS
              </span>
            </Badge>
          }
          accent="primary"
          placeholder="Basler Camera"
          subtext="Live Feed"
        />

        <FeedPanel
          title="Output (Marked)"
          action={<OutputViewToggle value={outputViewMode} onChange={setOutputViewMode} />}
          accent="warning"
        >
          {outputViewMode === "current" ? (
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Output
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground">No capture yet</div>
            </div>
          ) : (
            <OutputHistoryPanel />
          )}
        </FeedPanel>

        <DashboardStatsPanel />
      </div>
    </div>
  );
}
