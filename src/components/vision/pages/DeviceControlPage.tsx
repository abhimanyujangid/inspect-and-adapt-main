import { useState } from "react";
import { PageHeader } from "../ui";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Device = {
  id: string;
  name: string;
  detail: string;
  online: boolean;
  action: "connect" | "trigger";
};

const INITIAL_DEVICES: Device[] = [
  { id: "camera", name: "Camera", detail: "Basler acA1300-60gc", online: false, action: "connect" },
  { id: "plc", name: "PLC Connection", detail: "192.168.0.1", online: false, action: "connect" },
  { id: "sov", name: "Solenoid Valve (SOV)", detail: "Reject Actuator", online: true, action: "trigger" },
  { id: "conveyor", name: "Conveyor", detail: "Conveyor motor control", online: false, action: "connect" },
];

const INITIAL_LOG = [
  "15:37:00 - Device control panel opened",
  "- Single frame captured",
];

function now() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export function DeviceControlPage() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [log, setLog] = useState<string[]>(INITIAL_LOG);

  const addLog = (entry: string) => setLog((prev) => [...prev, entry]);

  const toggleConnect = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, online: !d.online } : d)),
    );
    const device = devices.find((d) => d.id === id);
    if (device) {
      addLog(`${now()} - ${device.name} ${device.online ? "disconnected" : "connected"}`);
    }
  };

  const triggerSov = () => addLog(`${now()} - SOV triggered once`);
  const captureFrame = () => addLog(`${now()} - Single frame captured`);

  return (
    <>
      <PageHeader title="Device Control" subtitle="Monitor and control connected hardware" />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onAction={() =>
                device.action === "connect"
                  ? toggleConnect(device.id)
                  : addLog(`${now()} - Camera triggered via SOV`)
              }
            />
          ))}
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Manual Test</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={triggerSov}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-semibold text-foreground shadow-sm transition hover:bg-surface"
            >
              <RotateCcw className="h-4 w-4" />
              Trigger SOV Once
            </button>
            <button
              onClick={captureFrame}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-muted text-sm font-semibold text-muted-foreground shadow-sm transition hover:bg-muted/80"
            >
              <RotateCcw className="h-4 w-4" />
              Capture Single Frame
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Activity Log</h2>
          <div className="rounded-lg bg-[oklch(0.28_0.01_250)] px-5 py-4 font-mono text-sm leading-relaxed text-[oklch(0.88_0_0)]">
            {log.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function DeviceCard({
  device,
  onAction,
}: {
  device: Device;
  onAction: () => void;
}) {
  const isTrigger = device.action === "trigger";

  return (
    <article className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">{device.name}</h3>
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              device.online ? "bg-success" : "bg-destructive",
            )}
          />
          <span className={device.online ? "text-success" : "text-destructive"}>
            {device.online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-3">
        <p className="text-sm text-muted-foreground">{device.detail}</p>
        <button
          onClick={onAction}
          className={cn(
            "shrink-0 rounded-md px-4 py-2 text-sm font-semibold text-white transition",
            isTrigger
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-success hover:bg-success/90",
          )}
        >
          {isTrigger ? "Trigger Camera" : "Connect"}
        </button>
      </div>
    </article>
  );
}
