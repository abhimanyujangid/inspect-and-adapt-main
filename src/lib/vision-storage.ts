export type ProfileStatus = "pending" | "active" | "inactive";

export type PlcParams = {
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

export type PlcConfiguration = {
  id: string;
  name: string;
  ip: string;
  rack: string;
  slot: string;
  dbNumber: string;
  params: PlcParams;
};

export type CameraConfiguration = {
  cameraName: string;
  exposure: string;
  gain: string;
  fps: string;
  pixelFormat: string;
  triggerMode: string;
  roi: { x: number; y: number; width: number; height: number };
  capType: string;
  hsv: {
    hueLower: number;
    hueUpper: number;
    satLower: number;
    satUpper: number;
    brightLower: number;
    brightUpper: number;
  };
};

export type DatasetImage = {
  id: string;
  name: string;
  dataUrl: string;
  capturedAt: string;
};

export type Dataset = {
  id: string;
  name: string;
  images: DatasetImage[];
};

export type Model = {
  id: string;
  name: string;
  datasetId: string;
  status: "trained";
  active: boolean;
  threshold: string;
};

export type Profile = {
  id: string;
  capName: string;
  status: ProfileStatus;
  createdAt: string;
  plcConfigurations: PlcConfiguration[];
  cameraConfiguration: CameraConfiguration;
  datasets: Dataset[];
  models: Model[];
};

export type VisionStorage = {
  profiles: Profile[];
  activeProfileId: string;
};

const STORAGE_KEY = "baitech-vision:v1";

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptyPlcParams(): PlcParams {
  return {
    encoderPpr: "1024",
    pulsesPerCap: "8",
    triggerPulseMs: "5",
    lightTriggerMs: "10",
    resultWaitMs: "50",
    triggerDelayMs: "0",
    triggerDelayCount: "0",
    sovOnTimeMs: "80",
    rejectDelayCount: "3",
  };
}

export function createEmptyPlcConfig(): PlcConfiguration {
  return {
    id: createId("plc"),
    name: "",
    ip: "",
    rack: "0",
    slot: "1",
    dbNumber: "100",
    params: createEmptyPlcParams(),
  };
}

export function createEmptyCameraConfiguration(): CameraConfiguration {
  return {
    cameraName: "Basler acA1300-60gc",
    exposure: "30",
    gain: "Mono8",
    fps: "30",
    pixelFormat: "Mono8",
    triggerMode: "Hardware Trigger",
    roi: { x: 87, y: 80, width: 600, height: 480 },
    capType: "Bally Blue Caps",
    hsv: {
      hueLower: 100,
      hueUpper: 100,
      satLower: 50,
      satUpper: 50,
      brightLower: 50,
      brightUpper: 50,
    },
  };
}

export function createEmptyProfile(capName: string): Profile {
  return {
    id: createId("profile"),
    capName,
    status: "pending",
    createdAt: new Date().toISOString(),
    plcConfigurations: [],
    cameraConfiguration: createEmptyCameraConfiguration(),
    datasets: [],
    models: [],
  };
}

export function emptyVisionStorage(): VisionStorage {
  return { profiles: [], activeProfileId: "" };
}

export function loadVisionStorage(): VisionStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyVisionStorage();
    const parsed = JSON.parse(raw) as VisionStorage;
    if (!parsed || !Array.isArray(parsed.profiles)) return emptyVisionStorage();
    return {
      profiles: parsed.profiles,
      activeProfileId: typeof parsed.activeProfileId === "string" ? parsed.activeProfileId : "",
    };
  } catch {
    console.warn("Failed to load vision storage, resetting.");
    return emptyVisionStorage();
  }
}

export function saveVisionStorage(state: VisionStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save vision storage:", err);
    alert("Storage limit reached. Try deleting some captured images.");
  }
}

export function activateProfile(profiles: Profile[], profileId: string): Profile[] {
  return profiles.map((p) => ({
    ...p,
    status: p.id === profileId ? "active" : p.status === "active" ? "inactive" : p.status,
  }));
}

export function finishProfile(profiles: Profile[], profileId: string): Profile[] {
  return profiles.map((p) => ({
    ...p,
    status: p.id === profileId ? "active" : p.status === "active" ? "inactive" : p.status,
  }));
}

export function mockCaptureDataUrl(label: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 240;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, 320, 240);
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(160, 120, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, 160, 200);
  return canvas.toDataURL("image/jpeg", 0.6);
}

export type ProfilePageProps = {
  profile: Profile;
  readOnly?: boolean;
  onUpdate: (profile: Profile) => void;
};
