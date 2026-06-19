import { Play } from "lucide-react";
import { CAPTURE_CAMERA_OPTIONS } from "./useImageCapture";
import { Btn, Field, Input, Select } from "./ui";

export function ImageCaptureControlsPanel({
  readOnly,
  count,
  capturing,
  selectedDatasetId,
  datasets,
  onCountChange,
  onDatasetChange,
  onStartCapture,
}: {
  readOnly?: boolean;
  count: number;
  capturing: boolean;
  selectedDatasetId: string;
  datasets: { id: string; name: string }[];
  onCountChange: (count: number) => void;
  onDatasetChange: (id: string) => void;
  onStartCapture: () => void;
}) {
  return (
    <div className="max-w-xl">
      <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
        Image Capture Controls
      </div>
      <div className="mt-2 rounded-sm border border-border bg-card p-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Select Camera">
            <Select disabled={readOnly}>
              {CAPTURE_CAMERA_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
          </Field>
          <Field label="Select Dataset">
            <Select
              value={selectedDatasetId}
              onChange={(e) => onDatasetChange(e.target.value)}
              disabled={readOnly}
            >
              {!selectedDatasetId && <option value="">Select dataset</option>}
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {!readOnly && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Number of Images">
              <Input
                type="number"
                min={1}
                value={count}
                onChange={(e) => onCountChange(Number(e.target.value))}
              />
            </Field>
            <div className="flex items-end">
              <Btn
                variant="outline"
                className="w-full"
                onClick={onStartCapture}
                disabled={!selectedDatasetId || capturing}
              >
                <Play className="h-3 w-3" />
                {capturing ? "Capturing…" : "Start Batch"}
              </Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
