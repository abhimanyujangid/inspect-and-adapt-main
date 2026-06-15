import { useEffect, useState } from "react";
import { PageHeader, Field, Input, Btn } from "../ui";
import { Plus, Save, Plug, Unplug } from "lucide-react";
import {
  createEmptyPlcConfig,
  type PlcConfiguration,
  type ProfilePageProps,
} from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

export function PlcConfigPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const [draft, setDraft] = useState<PlcConfiguration>(createEmptyPlcConfig());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const configs = profile.plcConfigurations;

  useEffect(() => {
    if (configs.length > 0 && !selectedId && !isNew) {
      selectConfig(configs[0]);
    }
  }, [configs.length]);

  const selectConfig = (config: PlcConfiguration) => {
    setDraft({ ...config, params: { ...config.params } });
    setSelectedId(config.id);
    setIsNew(false);
    setConnected(false);
  };

  const startNew = () => {
    setDraft(createEmptyPlcConfig());
    setSelectedId(null);
    setIsNew(true);
    setConnected(false);
  };

  const updateField = <K extends keyof PlcConfiguration>(key: K, value: PlcConfiguration[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateParam = (key: keyof PlcConfiguration["params"], value: string) => {
    setDraft((prev) => ({
      ...prev,
      params: { ...prev.params, [key]: value },
    }));
  };

  const saveSettings = () => {
    if (isNew) {
      onUpdate({
        ...profile,
        plcConfigurations: [...configs, draft],
      });
      setSelectedId(draft.id);
      setIsNew(false);
    } else {
      onUpdate({
        ...profile,
        plcConfigurations: configs.map((c) => (c.id === draft.id ? draft : c)),
      });
    }
  };

  const disabled = readOnly;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="PLC Configuration"
        subtitle="Connection settings — saved to user config"
        actions={
          !readOnly ? (
            <Btn onClick={startNew}>
              <Plus className="h-3.5 w-3.5" />
              New Configuration
            </Btn>
          ) : undefined
        }
      />

      <div className="flex min-h-0 flex-1">
        <aside className="w-56 shrink-0 border-r border-border bg-sidebar/30 p-3">
          <div className="flex flex-col gap-1">
            {configs.map((config) => {
              const active = config.id === selectedId && !isNew;
              return (
                <button
                  key={config.id}
                  onClick={() => selectConfig(config)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-left transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <div className="text-sm font-semibold">{config.name || "Unnamed"}</div>
                  <div
                    className={cn(
                      "mt-0.5 text-xs",
                      active ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {config.ip || "No IP set"}
                  </div>
                </button>
              );
            })}
            {configs.length === 0 && (
              <p className="px-2 py-3 text-xs text-muted-foreground">No configurations yet.</p>
            )}
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
          <ConfigSection title="Configuration">
            <Field label="Config Name">
              <Input
                value={draft.name}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={disabled}
              />
            </Field>
          </ConfigSection>

          <ConfigSection title="Connection">
            <div className="grid grid-cols-2 gap-4">
              <Field label="IP Address">
                <Input
                  value={draft.ip}
                  onChange={(e) => updateField("ip", e.target.value)}
                  placeholder="192.168.0.10"
                  disabled={disabled}
                />
              </Field>
              <Field label="Rack">
                <Input
                  type="number"
                  value={draft.rack}
                  onChange={(e) => updateField("rack", e.target.value)}
                  disabled={disabled}
                />
              </Field>
              <Field label="Slot">
                <Input
                  type="number"
                  value={draft.slot}
                  onChange={(e) => updateField("slot", e.target.value)}
                  disabled={disabled}
                />
              </Field>
              <Field label="DB Number">
                <Input
                  type="number"
                  value={draft.dbNumber}
                  onChange={(e) => updateField("dbNumber", e.target.value)}
                  disabled={disabled}
                />
              </Field>
            </div>
            {!readOnly && (
              <div className="mt-4 flex justify-end gap-2">
                <Btn variant="success" onClick={() => setConnected(true)}>
                  <Plug className="h-3.5 w-3.5" />
                  Connect
                </Btn>
                <Btn variant="danger" onClick={() => setConnected(false)}>
                  <Unplug className="h-3.5 w-3.5" />
                  Disconnect
                </Btn>
              </div>
            )}
            {connected && (
              <p className="mt-3 text-right text-xs text-success">
                Connected to {draft.ip || "—"}
              </p>
            )}
          </ConfigSection>

          <ConfigSection title="PLC Parameters">
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(draft.params) as (keyof typeof draft.params)[]).map((key) => (
                <Field key={key} label={PARAM_LABELS[key]}>
                  <Input
                    type="number"
                    value={draft.params[key]}
                    onChange={(e) => updateParam(key, e.target.value)}
                    disabled={disabled}
                  />
                </Field>
              ))}
            </div>
          </ConfigSection>

          {!readOnly && (
            <div className="flex justify-end">
              <Btn onClick={saveSettings}>
                <Save className="h-3.5 w-3.5" />
                Save Settings
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PARAM_LABELS: Record<string, string> = {
  encoderPpr: "Encoder PPR",
  pulsesPerCap: "Pulses/Cap",
  triggerPulseMs: "Trigger Pulse (ms)",
  lightTriggerMs: "Light Trigger (ms)",
  resultWaitMs: "Result Wait (ms)",
  triggerDelayMs: "Trigger Delay (ms)",
  triggerDelayCount: "Trigger Delay Count",
  sovOnTimeMs: "SOV ON Time (ms)",
  rejectDelayCount: "Reject Delay Count",
};

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
