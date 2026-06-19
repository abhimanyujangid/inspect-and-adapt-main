import { PageHeader, Panel, Badge, Btn } from "../ui";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const ALARMS = [
  {
    t: "12:42:18",
    sev: "critical",
    code: "E-3041",
    msg: "Rejector cylinder timeout — line 2",
    ack: false,
  },
  {
    t: "12:39:02",
    sev: "warning",
    code: "W-1208",
    msg: "Camera exposure auto-corrected (+12%)",
    ack: false,
  },
  {
    t: "12:31:55",
    sev: "info",
    code: "I-0021",
    msg: "Profile switched to Bottle Cap V2",
    ack: true,
  },
  { t: "12:22:10", sev: "warning", code: "W-1142", msg: "Conveyor speed deviation 6%", ack: true },
  {
    t: "11:58:33",
    sev: "critical",
    code: "E-3017",
    msg: "PLC heartbeat lost (recovered 4s)",
    ack: true,
  },
  {
    t: "11:40:09",
    sev: "info",
    code: "I-0007",
    msg: "Model loaded: bcap_v2_resnet50_q.onnx",
    ack: true,
  },
] as const;

export function AlarmPage() {
  return (
    <>
      <PageHeader
        title="Alarms & Events"
        subtitle="System diagnostics and operator notifications"
        actions={
          <>
            <Btn variant="outline">Filter</Btn>
            <Btn variant="outline">Export Log</Btn>
            <Btn>Acknowledge All</Btn>
          </>
        }
      />
      <div className="grid grid-cols-12 gap-3 p-5">
        <Panel title="Active" className="col-span-3">
          <div className="text-3xl font-bold font-mono-tabular text-destructive">2</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Unacknowledged
          </div>
        </Panel>
        <Panel title="24h Summary" className="col-span-9">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <SummaryRow
              icon={<AlertCircle className="h-3.5 w-3.5 text-destructive" />}
              label="Critical"
              value="4"
            />
            <SummaryRow
              icon={<AlertTriangle className="h-3.5 w-3.5 text-warning" />}
              label="Warnings"
              value="11"
            />
            <SummaryRow
              icon={<Info className="h-3.5 w-3.5 text-primary" />}
              label="Info"
              value="38"
            />
          </div>
        </Panel>

        {/* Event log table — maps to QTableWidget in PySide6 */}
        <Panel title="Event Log" className="col-span-12">
          <table className="w-full text-[11px]">
            <thead className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-1.5 text-left font-bold">Time</th>
                <th className="py-1.5 text-left font-bold">Severity</th>
                <th className="py-1.5 text-left font-bold">Code</th>
                <th className="py-1.5 text-left font-bold">Message</th>
                <th className="py-1.5 text-right font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {ALARMS.map((a, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5 font-mono-tabular text-muted-foreground">{a.t}</td>
                  <td className="py-1.5">
                    {a.sev === "critical" && <Badge tone="destructive">CRITICAL</Badge>}
                    {a.sev === "warning" && <Badge tone="warning">WARNING</Badge>}
                    {a.sev === "info" && <Badge tone="primary">INFO</Badge>}
                  </td>
                  <td className="py-1.5 font-mono-tabular text-muted-foreground">{a.code}</td>
                  <td className="py-1.5 text-foreground">{a.msg}</td>
                  <td className="py-1.5 text-right">
                    {a.ack ? (
                      <Badge>ACK</Badge>
                    ) : (
                      <Btn variant="outline" className="h-6 px-2">
                        Acknowledge
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2 rounded-sm">
      {icon}
      <div className="flex-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono-tabular text-base font-bold">{value}</div>
    </div>
  );
}
