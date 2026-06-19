import type { CameraConfiguration } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { HsvEditableTable } from "./HsvEditableTable";
import { Field, Select, Btn } from "./ui";

export function CameraHsvPanel({
  draft,
  readOnly,
  onSet,
  onUpdateHsv,
  onApply,
}: {
  draft: CameraConfiguration;
  readOnly?: boolean;
  onSet: <K extends keyof CameraConfiguration>(key: K, value: CameraConfiguration[K]) => void;
  onUpdateHsv: (key: keyof CameraConfiguration["hsv"], value: string) => void;
  onApply: () => void;
}) {
  return (
    <ConfigSectionPanel title="Pre Processing">
      <Field label="Cap Type">
        <Select value={draft.capType} onChange={(e) => onSet("capType", e.target.value)} disabled={readOnly}>
          <option>Bally Blue Caps</option>
          <option>Red Caps Line B</option>
          <option>Standard Bottle Cap</option>
        </Select>
      </Field>
      <div className="mt-3">
        <HsvEditableTable hsv={draft.hsv} readOnly={readOnly} onUpdate={onUpdateHsv} />
      </div>
      {!readOnly && (
        <div className="mt-3 flex justify-end">
          <Btn onClick={onApply}>Apply</Btn>
        </div>
      )}
    </ConfigSectionPanel>
  );
}
