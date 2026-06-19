import type { CameraConfiguration } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { Field, Input, Select, Btn } from "./ui";

export function CameraImageParamsPanel({
  draft,
  readOnly,
  onSet,
  onApply,
}: {
  draft: CameraConfiguration;
  readOnly?: boolean;
  onSet: <K extends keyof CameraConfiguration>(key: K, value: CameraConfiguration[K]) => void;
  onApply: () => void;
}) {
  return (
    <ConfigSectionPanel title="Image Parameters">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Exposure (µs)" hint="Min: 100 – Max: 100,000">
          <Input
            type="number"
            value={draft.exposure}
            onChange={(e) => onSet("exposure", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Gain" hint="Min: 0 – Max: 24.0">
          <Select
            value={draft.gain}
            onChange={(e) => onSet("gain", e.target.value)}
            disabled={readOnly}
          >
            <option>Mono8</option>
            <option>4.0</option>
            <option>8.0</option>
            <option>12.0</option>
          </Select>
        </Field>
        <Field label="FPS">
          <Input
            type="number"
            value={draft.fps}
            onChange={(e) => onSet("fps", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Pixel Format">
          <Select
            value={draft.pixelFormat}
            onChange={(e) => onSet("pixelFormat", e.target.value)}
            disabled={readOnly}
          >
            <option>Mono8</option>
            <option>Mono12</option>
            <option>BayerRG8</option>
          </Select>
        </Field>
        <div className="col-span-2">
          <Field label="Trigger Mode">
            <Select
              value={draft.triggerMode}
              onChange={(e) => onSet("triggerMode", e.target.value)}
              disabled={readOnly}
            >
              <option>Hardware Trigger</option>
              <option>Software Trigger</option>
              <option>Free-run</option>
            </Select>
          </Field>
        </div>
      </div>
      {!readOnly && (
        <div className="mt-3 flex justify-end">
          <Btn onClick={onApply}>Apply</Btn>
        </div>
      )}
    </ConfigSectionPanel>
  );
}
