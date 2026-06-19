import type { CameraConfiguration } from "@/lib/vision-storage";
import { HsvReadOnlyTable } from "./HsvReadOnlyTable";
import { ReadOnlyField } from "./ReadOnlyField";

export function CameraOverviewCard({ cam }: { cam: CameraConfiguration }) {
  const roi = cam.roi;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-x-4 gap-y-2">
        <ReadOnlyField label="Camera" value={cam.cameraName} />
        <ReadOnlyField label="Exposure (µs)" value={cam.exposure} />
        <ReadOnlyField label="Gain" value={cam.gain} />
        <ReadOnlyField label="FPS" value={cam.fps} />
        <ReadOnlyField label="Pixel Format" value={cam.pixelFormat} />
        <ReadOnlyField label="Trigger Mode" value={cam.triggerMode} />
        <ReadOnlyField label="Cap Type" value={cam.capType} />
      </div>

      <div className="border-t border-border pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          Region of Interest
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          <ReadOnlyField label="X" value={String(roi.x)} />
          <ReadOnlyField label="Y" value={String(roi.y)} />
          <ReadOnlyField label="Width" value={String(roi.width)} />
          <ReadOnlyField label="Height" value={String(roi.height)} />
        </div>
        <div className="mt-2 rounded-sm border border-border bg-surface px-3 py-1.5 font-mono-tabular text-[10px] text-muted-foreground">
          Area: {(roi.width * roi.height).toLocaleString()} px² — Center: (
          {roi.x + Math.round(roi.width / 2)}, {roi.y + Math.round(roi.height / 2)})
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
          HSV Pre-Processing
        </div>
        <HsvReadOnlyTable hsv={cam.hsv} />
      </div>
    </div>
  );
}
