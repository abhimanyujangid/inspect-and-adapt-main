import { Save } from "lucide-react";
import { Btn, Field, Input, Select } from "./ui";

export function TrainingConfigPanel({
  readOnly,
  label,
  datasetId,
  backbone,
  datasets,
  training,
  onLabelChange,
  onDatasetChange,
  onBackboneChange,
  onTrain,
}: {
  readOnly?: boolean;
  label: string;
  datasetId: string;
  backbone: string;
  datasets: { id: string; name: string; images: { length: number } }[];
  training: boolean;
  onLabelChange: (value: string) => void;
  onDatasetChange: (id: string) => void;
  onBackboneChange: (value: string) => void;
  onTrain: () => void;
}) {
  return (
    <section>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary">
        Training Configuration
      </div>
      <div className="rounded-sm border border-border bg-card p-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Training Label">
            <Input value={label} onChange={(e) => onLabelChange(e.target.value)} disabled={readOnly} />
          </Field>
          <Field label="Datasets">
            <Select value={datasetId} onChange={(e) => onDatasetChange(e.target.value)} disabled={readOnly}>
              {datasets.length === 0 && <option value="">No datasets</option>}
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.images.length} Images)
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Backbone">
            <Input
              value={backbone}
              placeholder="PatchCore"
              onChange={(e) => onBackboneChange(e.target.value)}
              disabled={readOnly}
            />
          </Field>
        </div>
        {!readOnly && (
          <Btn className="mt-4 h-9 w-full" onClick={onTrain} disabled={training || !datasetId}>
            <Save className="h-3.5 w-3.5" /> Train Model
          </Btn>
        )}
      </div>
    </section>
  );
}
