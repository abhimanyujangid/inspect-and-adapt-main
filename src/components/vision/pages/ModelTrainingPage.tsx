import type { ProfilePageProps } from "@/lib/vision-storage";
import { TrainingConfigPanel } from "../TrainingConfigPanel";
import { TrainingProgressPanel } from "../TrainingProgressPanel";
import { useModelTraining } from "../useModelTraining";
import { PageHeader } from "../ui";

export function ModelTrainingPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const training = useModelTraining(profile, onUpdate);

  return (
    <>
      <PageHeader
        title="Model Training"
        subtitle="Configure and monitor training jobs — settings saved on start"
      />
      <div className="p-5">
        <div className="grid grid-cols-2 gap-5">
          <TrainingConfigPanel
            readOnly={readOnly}
            label={training.label}
            datasetId={training.datasetId}
            backbone={training.backbone}
            datasets={training.datasets}
            training={training.training}
            onLabelChange={training.setLabel}
            onDatasetChange={training.setDatasetId}
            onBackboneChange={training.setBackbone}
            onTrain={training.trainModel}
          />
          <TrainingProgressPanel
            progress={training.progress}
            training={training.training}
            logs={training.logs}
          />
        </div>
      </div>
    </>
  );
}
