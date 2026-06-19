import { PageHeader, Field, Input, Btn } from "../ui";
import { Plus, Save } from "lucide-react";
import type { ProfilePageProps } from "@/lib/vision-storage";
import { ConfigSectionPanel } from "../ConfigSectionPanel";
import { PlcConfigListPanel } from "../PlcConfigListPanel";
import { PlcConnectionForm } from "../PlcConnectionForm";
import { PlcParametersForm } from "../PlcParametersForm";
import { usePlcConfigDraft } from "../usePlcConfigDraft";

export function PlcConfigPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const plc = usePlcConfigDraft(profile, onUpdate);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="PLC Configuration"
        subtitle="Connection settings — saved to user config"
        actions={
          !readOnly ? (
            <Btn onClick={plc.startNew}>
              <Plus className="h-3 w-3" />
              New Config
            </Btn>
          ) : undefined
        }
      />

      <div className="flex min-h-0 flex-1">
        <PlcConfigListPanel
          configs={plc.configs}
          selectedId={plc.selectedId}
          isNew={plc.isNew}
          readOnly={readOnly}
          onSelect={plc.selectConfig}
          onActivate={plc.handleActivatePlc}
          onDeactivate={plc.handleDeactivatePlc}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
          <ConfigSectionPanel title="Configuration">
            <Field label="Config Name">
              <Input
                value={plc.draft.name}
                onChange={(e) => plc.updateField("name", e.target.value)}
                disabled={readOnly}
              />
            </Field>
          </ConfigSectionPanel>

          <PlcConnectionForm
            draft={plc.draft}
            readOnly={readOnly}
            connected={plc.connected}
            onUpdateField={plc.updateField}
            onConnect={() => plc.setConnected(true)}
            onDisconnect={() => plc.setConnected(false)}
          />

          <PlcParametersForm
            draft={plc.draft}
            readOnly={readOnly}
            applied={plc.applied}
            onUpdateParam={plc.updateParam}
            onApply={plc.applyPlc}
          />

          {!readOnly && (
            <div className="flex justify-end">
              <Btn onClick={plc.persistDraft}>
                <Save className="h-3 w-3" />
                Save Settings
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
