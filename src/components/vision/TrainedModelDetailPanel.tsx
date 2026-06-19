import { RefreshCw, Save, Trash2 } from "lucide-react";
import type { Model, Profile } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { ReadOnlyField } from "./ReadOnlyField";
import { Btn, Field, Input } from "./ui";

export function TrainedModelDetailPanel({
  profile,
  selected,
  readOnly,
  threshold,
  onThresholdChange,
  onActivate,
  onDeactivate,
  onDelete,
  onSaveThreshold,
}: {
  profile: Profile;
  selected: Model;
  readOnly?: boolean;
  threshold: string;
  onThresholdChange: (value: string) => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onSaveThreshold: () => void;
}) {
  const dataset = profile.datasets.find((d) => d.id === selected.datasetId);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
      <ConfigSectionPanel title={selected.name}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <ReadOnlyField label="Dataset" value={dataset?.name ?? "—"} />
          <ReadOnlyField label="Cap Type" value={profile.capName} />
          <ReadOnlyField label="Training Images" value={String(dataset?.images.length ?? 0)} />
          <ReadOnlyField label="Status" value={selected.status} />
        </div>
        {!readOnly && (
          <div className="mt-4 flex justify-end gap-2">
            {selected.active ? (
              <Btn variant="outline" onClick={onDeactivate}>
                Deactivate
              </Btn>
            ) : (
              <Btn variant="success" onClick={onActivate}>
                <RefreshCw className="h-3 w-3" />
                Activate Model
              </Btn>
            )}
            <Btn variant="danger" className="px-2" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Btn>
          </div>
        )}
      </ConfigSectionPanel>

      <ConfigSectionPanel title="Reject Threshold">
        <p className="text-[10px] text-muted-foreground">
          Lower = more sensitive, more rejections. Higher = less sensitive, may miss defects.
        </p>
        <div className="mt-3">
          <Field label="Threshold Value">
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={threshold}
              onChange={(e) => onThresholdChange(e.target.value)}
              disabled={readOnly}
            />
          </Field>
          <div className="mt-1.5 flex justify-between text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>More Sensitive: 0.00</span>
            <span>Less Sensitive: 1.00</span>
          </div>
        </div>
        {!readOnly && (
          <Btn className="mt-4 h-8 w-full" onClick={onSaveThreshold}>
            <Save className="h-3 w-3" />
            Save Threshold
          </Btn>
        )}
      </ConfigSectionPanel>
    </div>
  );
}
