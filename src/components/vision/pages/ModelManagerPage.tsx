import { PageHeader } from "../ui";
import { TrainedModelsPanel } from "../TrainedModelsPanel";
import type { ProfilePageProps } from "@/lib/vision-storage";

export function ModelManagerPage(props: ProfilePageProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Model Manager"
        subtitle="Trained models available for deployment"
      />
      <div className="min-h-0 flex-1">
        <TrainedModelsPanel {...props} />
      </div>
    </div>
  );
}
