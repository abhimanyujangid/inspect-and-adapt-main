import { useEffect, useState } from "react";
import { PageHeader, Field, Input, Btn } from "../ui";
import { Plus, Save, Plug, Unplug, Check } from "lucide-react";
import {
  activatePlc,
  createEmptyPlcConfig,
  type PlcConfiguration,
  type ProfilePageProps,
} from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

export function PlcConfigPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const [draft, setDraft] = useState<PlcConfiguration>(createEmptyPlcConfig());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [applied, setApplied] = useState(false);
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

  const persistDraft = () => {
    const toSave: PlcConfiguration =
      isNew && configs.length === 0 ? { ...draft, active: true } : draft;

    if (isNew) {
      onUpdate({
        ...profile,
        plcConfigurations: [...configs, toSave],
      });
      setDraft(toSave);
      setSelectedId(toSave.id);
      setIsNew(false);
    } else {
      onUpdate({
        ...profile,
        plcConfigurations: configs.map((c) => (c.id === draft.id ? draft : c)),
      });
    }
  };

  const handleActivatePlc = (plcId: string) => {
    onUpdate({
      ...profile,
      plcConfigurations: activatePlc(configs, plcId),
    });
    if (draft.id === plcId) {
      setDraft((prev) => ({ ...prev, active: true }));
    } else {
      setDraft((prev) => ({ ...prev, active: false }));
    }
  };

  const handleDeactivatePlc = (plcId: string) => {
    onUpdate({
      ...profile,
      plcConfigurations: configs.map((c) =>
        c.id === plcId ? { ...c, active: false } : c,
      ),
    });
    if (draft.id === plcId) {
      setDraft((prev) => ({ ...prev, active: false }));
    }
  };

  const saveSettings = () => {
    persistDraft();
  };

  const applyPlc = () => {
    persistDraft();
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
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
              <Plus className="h-3 w-3" />
              New Config
            </Btn>
          ) : undefined
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Config list sidebar — maps to QListWidget */}
        <aside className="w-56 shrink-0 border-r border-border bg-sidebar p-2">
          <div className="flex flex-col gap-1">
            {configs.map((config) => {
              const selected = config.id === selectedId && !isNew;
              return (
                <div
                  key={config.id}
                  className={cn(
                    "rounded-sm border-l-2 px-3 py-2",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:bg-surface-2",
                  )}
                >
                  <button
                    onClick={() => selectConfig(config)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={cn("text-[11px] font-bold", selected ? "text-primary" : "text-foreground")}>
                        {config.name || "Unnamed"}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                          config.active
                            ? "bg-success/15 text-success"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {config.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className={cn("mt-0.5 font-mono-tabular text-[9px]", selected ? "text-primary/70" : "text-muted-foreground")}>
                      {config.ip || "No IP set"}
                    </div>
                  </button>
                  {!readOnly && (
                    <div className="mt-2 flex gap-1">
                      {!config.active ? (
                        <button
                          onClick={() => handleActivatePlc(config.id)}
                          className="flex-1 rounded-sm bg-primary px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeactivatePlc(config.id)}
                          className="flex-1 rounded-sm border border-border bg-surface px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-surface-2"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {configs.length === 0 && (
              <p className="px-2 py-3 text-[10px] text-muted-foreground">No configurations yet.</p>
            )}
          </div>
        </aside>

        {/* Config form — maps to QFormLayout */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
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
            <div className="grid grid-cols-2 gap-3">
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
              <div className="mt-3 flex justify-end gap-2">
                <Btn variant="success" onClick={() => setConnected(true)}>
                  <Plug className="h-3 w-3" />
                  Connect
                </Btn>
                <Btn variant="danger" onClick={() => setConnected(false)}>
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
          </ConfigSection>

          <ConfigSection title="PLC Parameters">
            <div className="grid grid-cols-3 gap-3">
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
            {!readOnly && (
              <div className="mt-3 flex justify-end gap-2">
                <Btn variant="success" onClick={applyPlc}>
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
          </ConfigSection>

          {!readOnly && (
            <div className="flex justify-end">
              <Btn onClick={saveSettings}>
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
    <section className="border border-border bg-card rounded-sm">
      <header className="border-b-2 border-primary bg-surface-2 px-4 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary">{title}</h2>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
