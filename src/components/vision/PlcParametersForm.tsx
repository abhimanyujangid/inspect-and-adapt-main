import type { PlcConfiguration } from "@/lib/vision-storage";
import { PLC_PARAM_LABELS } from "@/lib/vision-plc";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { Field, Input, Btn } from "./ui";
import { Check } from "lucide-react";

export function PlcParametersForm({
  draft,
  readOnly,
  applied,
  onUpdateParam,
  onApply,
}: {
  draft: PlcConfiguration;
  readOnly?: boolean;
  applied: boolean;
  onUpdateParam: (key: keyof PlcConfiguration["params"], value: string) => void;
  onApply: () => void;
}) {
  return (
    <ConfigSectionPanel title="PLC Parameters">
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(draft.params) as (keyof typeof draft.params)[]).map((key) => (
          <Field key={key} label={PLC_PARAM_LABELS[key] ?? key}>
            <Input
              type="number"
              value={draft.params[key]}
              onChange={(e) => onUpdateParam(key, e.target.value)}
              disabled={readOnly}
            />
          </Field>
        ))}
      </div>
      {!readOnly && (
        <div className="mt-3 flex justify-end gap-2">
          <Btn variant="success" onClick={onApply}>
            <Check className="h-3 w-3" />
            Apply PLC
          </Btn>
        </div>
      )}
      {applied && (
        <p className="mt-2 text-right text-[10px] font-bold text-success">
          ● PLC parameters applied
        </p>
      )}
    </ConfigSectionPanel>
  );
}
