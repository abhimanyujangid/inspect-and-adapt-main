import { Save, Upload } from "lucide-react";
import type { ProfilePageProps } from "@/lib/vision-storage";
import { CameraHsvPanel } from "../CameraHsvPanel";
import { CameraImageParamsPanel } from "../CameraImageParamsPanel";
import { CameraLivePreviewPanel } from "../CameraLivePreviewPanel";
import { CameraRoiPanel } from "../CameraRoiPanel";
import { CAMERA_OPTIONS, useCameraConfigDraft } from "../useCameraConfigDraft";
import { Field, PageHeader, Select, Btn } from "../ui";

export function CameraConfigPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const camera = useCameraConfigDraft(profile, onUpdate);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Camera Configuration"
        subtitle="Configure and preview cameras — settings saved per camera"
        actions={
          <div className="w-52 shrink-0">
            <Field label="Select Camera">
              <Select
                value={camera.draft.cameraName}
                onChange={(e) => camera.set("cameraName", e.target.value)}
                disabled={readOnly}
              >
                {CAMERA_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <CameraLivePreviewPanel draft={camera.draft} />

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5 xl:pt-5">
          <CameraImageParamsPanel
            draft={camera.draft}
            readOnly={readOnly}
            onSet={camera.set}
            onApply={camera.applySection}
          />
          <CameraRoiPanel
            draft={camera.draft}
            roiStats={camera.roiStats}
            readOnly={readOnly}
            onUpdateRoi={camera.updateRoi}
            onApply={camera.applySection}
          />
          <CameraHsvPanel
            draft={camera.draft}
            readOnly={readOnly}
            onSet={camera.set}
            onUpdateHsv={camera.updateHsv}
            onApply={camera.applySection}
          />

          {!readOnly && (
            <div className="flex justify-end gap-2">
              <Btn variant="success">
                <Upload className="h-3 w-3" /> Load Image
              </Btn>
              <Btn variant="danger">Trigger Camera</Btn>
              <Btn onClick={camera.saveSettings}>
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
