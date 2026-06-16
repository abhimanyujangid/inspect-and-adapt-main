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
            <Btn onClick={() => setModalOpen(true)}>
              <FolderPlus className="h-3 w-3" />
              Create Dataset
            </Btn>
          ) : undefined
        }
      />

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {/* Live preview — maps to QLabel with QPixmap */}
          <div className="overflow-hidden border border-border bg-card rounded-sm">
            <div className="flex items-center justify-between bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <span>Live Preview</span>
              <span className="font-mono-tabular">Dataset: {selectedDataset?.name ?? "—"}</span>
            </div>
            <div className="flex h-[400px] items-center justify-center bg-[#e8eaee] grid-bg">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">No image captured</span>
              )}
            </div>
          </div>

          {/* Capture controls — maps to QGroupBox with QFormLayout */}
          <div className="flex flex-col gap-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">Image Capture Controls</div>
            <div className="border border-border bg-card p-4 rounded-sm">
              <div className="grid grid-cols-2 gap-3">
                <CaptureField label="Select Camera">
                  <select className="h-8 w-full rounded-sm border border-border bg-input px-2 text-[11px] disabled:opacity-50" disabled={readOnly}>
                    {CAMERA_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </CaptureField>
                <CaptureField label="Select Dataset">
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    className="h-8 w-full rounded-sm border border-border bg-input px-2 text-[11px] disabled:opacity-50"
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
                    className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-sm bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:brightness-110 disabled:opacity-40"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Capture Single Image
                  </button>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <CaptureField label="Number of Images">
                      <input
                        type="number"
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="h-8 w-full rounded-sm border border-border bg-input px-2 font-mono-tabular text-[11px]"
                      />
                    </CaptureField>
                    <div className="flex items-end">
                      <button
                        onClick={startCapturing}
                        disabled={!selectedDatasetId}
                        className="flex h-8 w-full items-center justify-center gap-2 rounded-sm border border-border bg-surface text-[10px] font-bold uppercase tracking-wider hover:bg-surface-2 disabled:opacity-40"
                      >
                        <Play className="h-3 w-3" />
                        Start Batch
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create dataset modal — maps to QDialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm border border-border bg-card rounded-sm">
            <div className="flex items-center justify-between border-b-2 border-primary bg-surface-2 px-4 py-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-primary">Create Dataset</h2>
              <button onClick={() => setModalOpen(false)} className="rounded-sm p-1 text-muted-foreground hover:bg-surface hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-4">
              <Field label="Folder Name">
                <Input
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateDataset()}
                />
              </Field>
              <div className="mt-4 flex justify-end gap-2">
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
    <label className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
