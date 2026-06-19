import type { PlcConfiguration } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "./ConfigSectionPanel";
import { Field, Input, Btn } from "./ui";
import { Plug, Unplug } from "lucide-react";

export function PlcConnectionForm({
  draft,
  readOnly,
  connected,
  onUpdateField,
  onConnect,
  onDisconnect,
}: {
  draft: PlcConfiguration;
  readOnly?: boolean;
  connected: boolean;
  onUpdateField: <K extends keyof PlcConfiguration>(key: K, value: PlcConfiguration[K]) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <ConfigSectionPanel title="Connection">
      <div className="grid grid-cols-2 gap-3">
        <Field label="IP Address">
          <Input
            value={draft.ip}
            onChange={(e) => onUpdateField("ip", e.target.value)}
            placeholder="192.168.0.10"
            disabled={readOnly}
          />
        </Field>
        <Field label="Rack">
          <Input
            type="number"
            value={draft.rack}
            onChange={(e) => onUpdateField("rack", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="Slot">
          <Input
            type="number"
            value={draft.slot}
            onChange={(e) => onUpdateField("slot", e.target.value)}
            disabled={readOnly}
          />
        </Field>
        <Field label="DB Number">
          <Input
            type="number"
            value={draft.dbNumber}
            onChange={(e) => onUpdateField("dbNumber", e.target.value)}
            disabled={readOnly}
          />
        </Field>
      </div>
      {!readOnly && (
        <div className="mt-3 flex justify-end gap-2">
          <Btn variant="success" onClick={onConnect}>
            <Plug className="h-3 w-3" />
            Connect
          </Btn>
          <Btn variant="danger" onClick={onDisconnect}>
            <Unplug className="h-3 w-3" />
            Disconnect
          </Btn>
        </div>
      )}
      {connected && (
        <p className="mt-2 text-right text-[10px] font-bold text-success">
          ● Connected to {draft.ip || "—"}
        </p>
      )}
    </ConfigSectionPanel>
  );
}
