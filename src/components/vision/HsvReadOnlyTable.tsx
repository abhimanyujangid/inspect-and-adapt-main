import type { CameraConfiguration } from "@/lib/vision-storage";

export function HsvReadOnlyTable({ hsv }: { hsv: CameraConfiguration["hsv"] }) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            <th className="w-20 px-3 py-1.5 text-left text-[9px] font-bold uppercase tracking-wider text-muted-foreground" />
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
          <tr className="border-b border-border">
            <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Lower</td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.hueLower}
            </td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.satLower}
            </td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.brightLower}
            </td>
          </tr>
          <tr>
            <td className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground">Upper</td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.hueUpper}
            </td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.satUpper}
            </td>
            <td className="px-3 py-1.5 text-center font-mono-tabular font-bold text-foreground">
              {hsv.brightUpper}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
