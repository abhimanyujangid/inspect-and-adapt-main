import { ConfirmModal } from "./ConfirmModal";
import { TrainedModelDetailPanel } from "./TrainedModelDetailPanel";
import { TrainedModelListPanel } from "./TrainedModelListPanel";
import { useTrainedModels } from "./useTrainedModels";
import type { ProfilePageProps } from "@/lib/vision-storage";

type Props = ProfilePageProps & {
  defaultSelectedId?: string;
};

export function TrainedModelsPanel({
  profile,
  readOnly,
  onUpdate,
  defaultSelectedId,
}: Props) {
  const models = useTrainedModels(profile, onUpdate, defaultSelectedId);

  if (!models.selected) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-[11px] text-muted-foreground">
        No trained models yet. Train a model in the Model Training step.
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full min-h-0">
        <TrainedModelListPanel
          models={models.models}
          selectedId={models.selectedId}
          profile={profile}
          onSelect={models.selectModel}
        />
        <TrainedModelDetailPanel
          profile={profile}
          selected={models.selected}
          readOnly={readOnly}
          threshold={models.threshold}
          onThresholdChange={models.setThreshold}
          onActivate={models.activateModel}
          onDeactivate={models.deactivateModel}
          onDelete={() => models.setDeleteId(models.selected!.id)}
          onSaveThreshold={models.saveThreshold}
        />
      </div>

      <ConfirmModal
        open={models.deleteId !== null}
        title="Delete Model"
        message="Are you sure you want to delete this model?"
        confirmLabel="Delete"
        danger
        onConfirm={models.deleteModel}
        onCancel={() => models.setDeleteId(null)}
      />
    </>
  );
}
