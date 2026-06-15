import { PageHeader, Panel, Btn, Badge } from "../ui";
import { CheckCircle2 } from "lucide-react";

const MODELS = [
  { name: "bcap_v2_resnet50_q.onnx", profile: "Bottle Cap V2", acc: "97.4%", size: "94 MB", deployed: true, trained: "2026-06-09 12:43" },
  { name: "bcap_v2_effb0.onnx", profile: "Bottle Cap V2", acc: "96.8%", size: "21 MB", deployed: false, trained: "2026-06-08 19:11" },
  { name: "bcap_v1_resnet50.onnx", profile: "Bottle Cap V1", acc: "94.2%", size: "94 MB", deployed: false, trained: "2025-11-04 09:22" },
  { name: "blue_cap_yolov8.onnx", profile: "Blue Cap Inspection", acc: "—", size: "53 MB", deployed: false, trained: "2026-06-10 08:00" },
];

export function ModelManagerPage() {
  return (
    <>
      <PageHeader title="Model Manager" subtitle="Trained models available for deployment"
        actions={<Btn variant="outline">Import</Btn>} />
      <div className="p-6">
        <Panel title="Models">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold">Model</th>
                <th className="py-2 text-left font-semibold">Profile</th>
                <th className="py-2 text-right font-semibold">Accuracy</th>
                <th className="py-2 text-right font-semibold">Size</th>
                <th className="py-2 text-right font-semibold">Trained</th>
                <th className="py-2 text-right font-semibold">Status</th>
                <th className="py-2 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m) => (
                <tr key={m.name} className="border-b border-border/50 hover:bg-surface">
                  <td className="py-2 font-mono-tabular text-xs">{m.name}</td>
                  <td className="py-2">{m.profile}</td>
                  <td className="py-2 text-right font-mono-tabular text-success">{m.acc}</td>
                  <td className="py-2 text-right font-mono-tabular text-muted-foreground">{m.size}</td>
                  <td className="py-2 text-right font-mono-tabular text-muted-foreground text-xs">{m.trained}</td>
                  <td className="py-2 text-right">
                    {m.deployed
                      ? <Badge tone="success"><CheckCircle2 className="h-3 w-3" /> DEPLOYED</Badge>
                      : <Badge>READY</Badge>}
                  </td>
                  <td className="py-2 text-right">
                    {!m.deployed && <Btn variant="outline" className="h-7 px-2">Deploy</Btn>}
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
