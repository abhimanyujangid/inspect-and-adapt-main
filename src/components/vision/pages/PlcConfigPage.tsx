import { useState } from "react";
import { PageHeader, Field, Input, Btn } from "../ui";
import { Plus, Save, Plug, Unplug } from "lucide-react";
import { cn } from "@/lib/utils";

type PlcConfig = {
  id: string;
  name: string;
  ip: string;
  cameraSerial: string;
  exposure: string;
  gain: string;
  rack: string;
  slot: string;
  dbNumber: string;
  params: {
    encoderPpr: string;
    pulsesPerCap: string;
    triggerPulseMs: string;
    lightTriggerMs: string;
    resultWaitMs: string;
    triggerDelayMs: string;
    triggerDelayCount: string;
    sovOnTimeMs: string;
    rejectDelayCount: string;
  };
};

const SEED_CONFIGS: PlcConfig[] = [
  {
    id: "new",
    name: "New Config",
    ip: "",
    cameraSerial: "",
    exposure: "",
    gain: "",
    rack: "0",
    slot: "1",
    dbNumber: "100",
    params: {
      encoderPpr: "1024",
      pulsesPerCap: "8",
      triggerPulseMs: "5",
      lightTriggerMs: "10",
      resultWaitMs: "50",
      triggerDelayMs: "0",
      triggerDelayCount: "0",
      sovOnTimeMs: "80",
      rejectDelayCount: "3",
    },
  },
  {
    id: "floor-a",
    name: "Factory Floor A",
    ip: "192.168.0.10",
    cameraSerial: "23194851",
    exposure: "2400",
    gain: "4.0",
    rack: "0",
    slot: "1",
    dbNumber: "100",
    params: {
      encoderPpr: "1024",
      pulsesPerCap: "8",
      triggerPulseMs: "5",
      lightTriggerMs: "10",
      resultWaitMs: "50",
      triggerDelayMs: "0",
      triggerDelayCount: "0",
      sovOnTimeMs: "80",
      rejectDelayCount: "3",
    },
  },
  {
    id: "floor-b",
    name: "Factory Floor B",
    ip: "192.168.0.11",
    cameraSerial: "23194852",
    exposure: "2200",
    gain: "3.5",
    rack: "0",
    slot: "1",
    dbNumber: "101",
    params: {
      encoderPpr: "2048",
      pulsesPerCap: "10",
      triggerPulseMs: "4",
      lightTriggerMs: "8",
      resultWaitMs: "45",
      triggerDelayMs: "2",
      triggerDelayCount: "1",
      sovOnTimeMs: "75",
      rejectDelayCount: "4",
    },
  },
  {
    id: "highspeed",
    name: "Highspeed Line 2",
    ip: "10.0.0.50",
    cameraSerial: "40192810",
    exposure: "1800",
    gain: "6.0",
    rack: "0",
    slot: "2",
    dbNumber: "200",
    params: {
      encoderPpr: "4096",
      pulsesPerCap: "12",
      triggerPulseMs: "3",
      lightTriggerMs: "6",
      resultWaitMs: "30",
      triggerDelayMs: "1",
      triggerDelayCount: "2",
      sovOnTimeMs: "60",
      rejectDelayCount: "2",
    },
  },
];

export function PlcConfigPage() {
  const [configs, setConfigs] = useState<PlcConfig[]>(SEED_CONFIGS);
  const [selectedId, setSelectedId] = useState("new");
  const [connected, setConnected] = useState(false);

  const selected = configs.find((c) => c.id === selectedId) ?? configs[0];

  const updateField = <K extends keyof PlcConfig>(key: K, value: PlcConfig[K]) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, [key]: value } : c)),
    );
  };

  const updateParam = (key: keyof PlcConfig["params"], value: string) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, params: { ...c.params, [key]: value } }
          : c,
      ),
    );
  };

  const addConfig = () => {
    const id = `cfg-${Date.now()}`;
    const newConfig: PlcConfig = {
      ...SEED_CONFIGS[0],
      id,
      name: "New Config",
      ip: "",
      cameraSerial: "",
      exposure: "",
      gain: "",
    };
    setConfigs((prev) => [newConfig, ...prev]);
    setSelectedId(id);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="PLC Configuration"
        subtitle="Connection settings — saved to user config"
        actions={
          <>
            <Btn variant="outline">Import</Btn>
            <Btn variant="outline">Export</Btn>
            <Btn onClick={addConfig}>
              <Plus className="h-3.5 w-3.5" />
              New Config
            </Btn>
          </>
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Config list — fixed */}
        <aside className="w-56 shrink-0 border-r border-border bg-sidebar/30 p-3">
          <div className="flex flex-col gap-1">
            {configs.map((config) => {
              const active = config.id === selectedId;
              return (
                <button
                  key={config.id}
                  onClick={() => setSelectedId(config.id)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-left transition",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <div className="text-sm font-semibold">{config.name}</div>
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
          </div>
        </aside>

        {/* Details — scrollable */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6">
          <ConfigSection title="Edit Configuration">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Config Name">
                <Input
                  value={selected.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>
              <Field label="Camera Serial">
                <Input
                  value={selected.cameraSerial}
                  onChange={(e) => updateField("cameraSerial", e.target.value)}
                />
              </Field>
              <Field label="Exposure (us)">
                <Input
                  type="number"
                  value={selected.exposure}
                  onChange={(e) => updateField("exposure", e.target.value)}
                />
              </Field>
              <Field label="Gain">
                <Input
                  value={selected.gain}
                  onChange={(e) => updateField("gain", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Btn>
                <Save className="h-3.5 w-3.5" />
                Save Settings
              </Btn>
            </div>
          </ConfigSection>

          <ConfigSection title="Connection">
            <div className="grid grid-cols-2 gap-4">
              <Field label="IP Address">
                <Input
                  value={selected.ip}
                  onChange={(e) => updateField("ip", e.target.value)}
                  placeholder="192.168.0.10"
                />
              </Field>
              <Field label="Rack">
                <Input
                  type="number"
                  value={selected.rack}
                  onChange={(e) => updateField("rack", e.target.value)}
                />
              </Field>
              <Field label="Slot">
                <Input
                  type="number"
                  value={selected.slot}
                  onChange={(e) => updateField("slot", e.target.value)}
                />
              </Field>
              <Field label="DB Number">
                <Input
                  type="number"
                  value={selected.dbNumber}
                  onChange={(e) => updateField("dbNumber", e.target.value)}
                />
              </Field>
            </div>
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
            {connected && (
              <p className="mt-3 text-right text-xs text-success">
                Connected to {selected.ip || "—"}
              </p>
            )}
          </ConfigSection>

          <ConfigSection title="PLC Parameters">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Encoder PPR">
                <Input
                  type="number"
                  value={selected.params.encoderPpr}
                  onChange={(e) => updateParam("encoderPpr", e.target.value)}
                />
              </Field>
              <Field label="Pulses/Cap">
                <Input
                  type="number"
                  value={selected.params.pulsesPerCap}
                  onChange={(e) => updateParam("pulsesPerCap", e.target.value)}
                />
              </Field>
              <Field label="Trigger Pulse (ms)">
                <Input
                  type="number"
                  value={selected.params.triggerPulseMs}
                  onChange={(e) => updateParam("triggerPulseMs", e.target.value)}
                />
              </Field>
              <Field label="Light Trigger (ms)">
                <Input
                  type="number"
                  value={selected.params.lightTriggerMs}
                  onChange={(e) => updateParam("lightTriggerMs", e.target.value)}
                />
              </Field>
              <Field label="Result Wait (ms)">
                <Input
                  type="number"
                  value={selected.params.resultWaitMs}
                  onChange={(e) => updateParam("resultWaitMs", e.target.value)}
                />
              </Field>
              <Field label="Trigger Delay (ms)">
                <Input
                  type="number"
                  value={selected.params.triggerDelayMs}
                  onChange={(e) => updateParam("triggerDelayMs", e.target.value)}
                />
              </Field>
              <Field label="Trigger Delay Count">
                <Input
                  type="number"
                  value={selected.params.triggerDelayCount}
                  onChange={(e) => updateParam("triggerDelayCount", e.target.value)}
                />
              </Field>
              <Field label="SOV ON Time (ms)">
                <Input
                  type="number"
                  value={selected.params.sovOnTimeMs}
                  onChange={(e) => updateParam("sovOnTimeMs", e.target.value)}
                />
              </Field>
              <Field label="Reject Delay Count">
                <Input
                  type="number"
                  value={selected.params.rejectDelayCount}
                  onChange={(e) => updateParam("rejectDelayCount", e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-4 flex justify-end">
              <Btn className="bg-foreground text-background hover:bg-foreground/90">
                Apply PLC
              </Btn>
            </div>
          </ConfigSection>
        </div>
      </div>
    </div>
  );
}

function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
