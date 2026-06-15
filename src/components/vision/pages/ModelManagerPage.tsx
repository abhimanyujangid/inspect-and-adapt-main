import { PageHeader } from "../ui";
import { TrainedModelsPanel, type TrainedModel } from "../TrainedModelsPanel";

export function ModelManagerPage({
  models,
  onSaveThreshold,
}: {
  models: TrainedModel[];
  onSaveThreshold: (id: string, threshold: string) => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Model Manager"
        subtitle="Trained models available for deployment"
      />
      <div className="min-h-0 flex-1">
        <TrainedModelsPanel models={models} onSaveThreshold={onSaveThreshold} />
      </div>
    </div>
  );
}
