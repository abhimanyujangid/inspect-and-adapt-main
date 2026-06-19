import type { CameraConfiguration } from "@/lib/vision-storage";
import { Input } from "./ui";

export function HsvEditableTable({
  hsv,
  readOnly,
  onUpdate,
}: {
  hsv: CameraConfiguration["hsv"];
  readOnly?: boolean;
  onUpdate: (key: keyof CameraConfiguration["hsv"], value: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            <th className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground" />
            <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Hue
            </th>
            <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Saturation
            </th>
            <th className="px-3 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              Brightness
            </th>
          </tr>
        </thead>
        <tbody>
          {(["Lower", "Upper"] as const).map((row) => (
            <tr key={row} className="border-b border-border last:border-0">
              <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">{row}:</td>
              {(["hue", "sat", "bright"] as const).map((col) => {
                const key = `${col}${row}` as keyof CameraConfiguration["hsv"];
                return (
                  <td key={key} className="px-2 py-1.5">
                    <Input
                      type="number"
                      className="h-7 text-center"
                      value={hsv[key]}
                      onChange={(e) => onUpdate(key, e.target.value)}
                      disabled={readOnly}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
