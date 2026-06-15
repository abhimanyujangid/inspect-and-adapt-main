import { useState } from "react";
import { FolderPlus, Camera, Play, X } from "lucide-react";
import { PageHeader, Btn, Field, Input } from "../ui";
import {
  createId,
  mockCaptureDataUrl,
  type ProfilePageProps,
} from "@/lib/vision-storage";

const CAMERA_OPTIONS = ["Camera 1", "Camera 2"];

export function ImageCapturePage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const [count, setCount] = useState(0);
  const [selectedDatasetId, setSelectedDatasetId] = useState(profile.datasets[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const datasets = profile.datasets;
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId);

  const handleCreateDataset = () => {
    const name = folderName.trim();
    if (!name) return;
    const newDataset = { id: createId("dataset"), name, images: [] };
    onUpdate({ ...profile, datasets: [...datasets, newDataset] });
    setSelectedDatasetId(newDataset.id);
    setFolderName("");
    setModalOpen(false);
  };

  const addImageToDataset = (dataUrl: string, label: string) => {
    if (!selectedDatasetId) return;
    const image = {
      id: createId("img"),
      name: label,
      dataUrl,
      capturedAt: new Date().toISOString(),
    };
    onUpdate({
      ...profile,
      datasets: datasets.map((d) =>
        d.id === selectedDatasetId ? { ...d, images: [...d.images, image] } : d,
      ),
    });
    setPreviewUrl(dataUrl);
  };

  const captureSingle = () => {
    const label = `capture_${Date.now()}.jpg`;
    addImageToDataset(mockCaptureDataUrl(label), label);
  };

  const startCapturing = () => {
    const n = Math.max(1, count || 1);
    for (let i = 0; i < n; i++) {
      const label = `batch_${Date.now()}_${i + 1}.jpg`;
      addImageToDataset(mockCaptureDataUrl(label), label);
    }
  };

  return (
    <>
      <PageHeader
        title="Image Capture"
        subtitle="Acquire training images — backend pending"
        actions={
          !readOnly ? (
            <Btn className="h-11 px-5 text-sm" onClick={() => setModalOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              Create Dataset
            </Btn>
          ) : undefined
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
              <span>Live Preview</span>
              <span>Dataset: {selectedDataset?.name ?? "—"}</span>
            </div>
            <div className="flex h-[440px] items-center justify-center bg-[oklch(0.22_0.01_250)]">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-sm text-muted-foreground">No image captured</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Image Captured</h2>
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-5">
                <CaptureField label="Select Camera">
                  <select className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm" disabled={readOnly}>
                    {CAMERA_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </CaptureField>
                <CaptureField label="Select Dataset">
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm"
                    disabled={readOnly}
                  >
                    {!selectedDatasetId && <option value="">Select dataset</option>}
                    {datasets.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </CaptureField>
              </div>

              {!readOnly && (
                <>
                  <button
                    onClick={captureSingle}
                    disabled={!selectedDatasetId}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                    Capture Single Image
                  </button>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <CaptureField label="Number of Image to Capture">
                      <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm"
                      />
                    </CaptureField>
                    <div className="flex items-end">
                      <button
                        onClick={startCapturing}
                        disabled={!selectedDatasetId}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-semibold hover:bg-surface-2 disabled:opacity-50"
                      >
                        <Play className="h-4 w-4" />
                        Start Capturing
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">Create Dataset</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <Field label="Folder Name">
                <Input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateDataset()}
                />
              </Field>
              <div className="mt-6 flex justify-end gap-2">
                <Btn variant="outline" onClick={() => setModalOpen(false)}>Cancel</Btn>
                <Btn onClick={handleCreateDataset} disabled={!folderName.trim()}>Create</Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CaptureField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
