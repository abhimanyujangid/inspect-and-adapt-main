import { Boxes, Cable, Camera, Images } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { getActivePlcConfigurations } from "@/lib/vision-storage";
import { CameraOverviewCard } from "../CameraOverviewCard";
import { CollapsibleSection, SectionEmptyHint } from "../CollapsibleSection";
import { DatasetOverviewRow } from "../DatasetOverviewRow";
import { ModelOverviewRow } from "../ModelOverviewRow";
import { PlcOverviewCard } from "../PlcOverviewCard";
import { ProfileEmptyState } from "../ProfileEmptyState";
import { ProfileOverviewHeader } from "../ProfileOverviewHeader";
import { ProfileQuickStatsPanel } from "../ProfileQuickStatsPanel";

export function ProfileOverviewPage({ profile }: { profile: Profile | null }) {
  if (!profile) return <ProfileEmptyState />;

  const activePlcs = getActivePlcConfigurations(profile.plcConfigurations);
  const totalPlcs = profile.plcConfigurations.length;

  return (
    <div className="flex h-full flex-col">
      <ProfileOverviewHeader profile={profile} />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-3 p-5">
          <ProfileQuickStatsPanel profile={profile} />

          <CollapsibleSection
            icon={Cable}
            title="PLC Configurations"
            count={activePlcs.length}
            defaultOpen
          >
            {activePlcs.length === 0 ? (
              <SectionEmptyHint>
                {totalPlcs === 0 ? "No PLC configurations set." : "No active PLC configuration."}
              </SectionEmptyHint>
            ) : (
              <div className="space-y-2">
                {activePlcs.map((plc) => (
                  <PlcOverviewCard key={plc.id} plc={plc} />
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection icon={Camera} title="Camera Configuration" defaultOpen>
            <CameraOverviewCard cam={profile.cameraConfiguration} />
          </CollapsibleSection>

          <CollapsibleSection
            icon={Images}
            title="Datasets & Gallery"
            count={profile.datasets.length}
          >
            {profile.datasets.length === 0 ? (
              <SectionEmptyHint>No datasets created yet.</SectionEmptyHint>
            ) : (
              <div className="space-y-1">
                {profile.datasets.map((ds) => (
                  <DatasetOverviewRow key={ds.id} ds={ds} />
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection icon={Boxes} title="Trained Models" count={profile.models.length}>
            {profile.models.length === 0 ? (
              <SectionEmptyHint>No models trained yet.</SectionEmptyHint>
            ) : (
              <div className="space-y-1">
                {profile.models.map((model) => (
                  <ModelOverviewRow key={model.id} model={model} datasets={profile.datasets} />
                ))}
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
