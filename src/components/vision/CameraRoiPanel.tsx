import type { CameraConfiguration } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { Field, Input, Btn } from "./ui";

export function CameraRoiPanel({
  draft,
  roiStats,
  readOnly,
  onUpdateRoi,
  onApply,
}: {
  draft: CameraConfiguration;
  roiStats: { area: number; cx: number; cy: number };
  readOnly?: boolean;
  onUpdateRoi: (key: keyof CameraConfiguration["roi"], value: string) => void;
  onApply: () => void;
}) {
  return (
    <ConfigSectionPanel title="Region of Interest">
      <div className="grid grid-cols-2 gap-3">
        <Field label="X Origin">
          <Input
            type="number"
            value={draft.roi.x}
            onChange={(e) => onUpdateRoi("x", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Y Origin">
          <Input
            type="number"
            value={draft.roi.y}
            onChange={(e) => onUpdateRoi("y", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Width">
          <Input
            type="number"
            value={draft.roi.width}
            onChange={(e) => onUpdateRoi("width", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Height">
          <Input
            type="number"
            value={draft.roi.height}
            onChange={(e) => onUpdateRoi("height", e.target.value)}
            disabled={readOnly}
          />
        </Field>
      </div>
      <div className="mt-3 rounded-sm border border-border bg-surface px-3 py-1.5 font-mono-tabular text-[10px] text-muted-foreground">
        Area: {roiStats.area.toLocaleString()} px² — Center: ({roiStats.cx}, {roiStats.cy})
      </div>
      {!readOnly && (
        <div className="mt-3 flex justify-end">
          <Btn onClick={onApply}>Apply</Btn>
        </div>
      )}
    </ConfigSectionPanel>
  );
}
