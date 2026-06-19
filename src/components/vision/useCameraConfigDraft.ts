import { useEffect, useMemo, useState } from "react";
import type { CameraConfiguration, Profile } from "@/lib/vision-storage";

export const CAMERA_OPTIONS = ["Basler acA1300-60gc", "Basler acA2440-35um", "FLIR BFS-PGE-50S5M"];

export function useCameraConfigDraft(profile: Profile, onUpdate: (profile: Profile) => void) {
  const cam = profile.cameraConfiguration;
  const [draft, setDraft] = useState<CameraConfiguration>(cam);

  useEffect(() => {
    setDraft(cam);
  }, [profile.id]);

  const roiStats = useMemo(() => {
    const area = draft.roi.width * draft.roi.height;
    const cx = draft.roi.x + Math.round(draft.roi.width / 2);
    const cy = draft.roi.y + Math.round(draft.roi.height / 2);
    return { area, cx, cy };
  }, [draft.roi]);

  const set = <K extends keyof CameraConfiguration>(key: K, value: CameraConfiguration[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateRoi = (key: keyof CameraConfiguration["roi"], value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setDraft((prev) => ({ ...prev, roi: { ...prev.roi, [key]: n } }));
  };

  const updateHsv = (key: keyof CameraConfiguration["hsv"], value: string) => {
    const n = parseInt(value, 10);
    if (!Number.isNaN(n)) setDraft((prev) => ({ ...prev, hsv: { ...prev.hsv, [key]: n } }));
  };

  const saveSettings = () => onUpdate({ ...profile, cameraConfiguration: draft });
  const applySection = () => onUpdate({ ...profile, cameraConfiguration: draft });

  return { draft, roiStats, set, updateRoi, updateHsv, saveSettings, applySection };
}
