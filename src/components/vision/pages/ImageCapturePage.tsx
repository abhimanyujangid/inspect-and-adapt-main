import { useState } from "react";
import { FolderPlus, Camera, Play, X } from "lucide-react";
import { PageHeader, Btn, Field, Input } from "../ui";

const CAMERA_OPTIONS = ["Select All", "Camera 1", "Camera 2"];

export function ImageCapturePage() {
  const [count, setCount] = useState(0);
  const [datasets, setDatasets] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateDataset = () => {
    const name = folderName.trim();
    if (!name) return;
    setDatasets((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setSelectedDataset(name);
    setFolderName("");
    setModalOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Image Capture"
        subtitle="Acquire training images — backend pending"
        actions={
          <Btn className="h-11 px-5 text-sm" onClick={() => setModalOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            Create Dataset
          </Btn>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
              <span>Live Preview</span>
              <span>Dataset: {selectedDataset || "—"}</span>
            </div>
            <div className="h-[440px] bg-[oklch(0.22_0.01_250)]" />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-foreground">Image Captured</h2>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-5">
                <CaptureField label="Select Camera">
                  <CaptureSelect options={CAMERA_OPTIONS} />
                </CaptureField>

                <CaptureField label="Select Dataset">
                  <CaptureSelect
                    value={selectedDataset}
                    onChange={setSelectedDataset}
                    options={datasets}
                    placeholder="Select dataset"
                  />
                </CaptureField>
              </div>

              <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
                Capture Single Image
              </button>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <CaptureField label="Number of Image to Capture">
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </CaptureField>
                <div className="flex items-end">
                  <button className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-semibold text-foreground hover:bg-surface-2">
                    <Play className="h-4 w-4" />
                    Start Capturing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Create Dataset</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
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
                <Btn variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Btn>
                <Btn onClick={handleCreateDataset} disabled={!folderName.trim()}>
                  Create
                </Btn>
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

function CaptureSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
}: {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  const controlled = value !== undefined;
  const selectValue = controlled ? value : options[0] ?? "";

  return (
    <select
      value={selectValue}
      onChange={(e) => onChange?.(e.target.value)}
      className="h-12 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
    >
      {controlled && !selectValue && (
        <option value="">{placeholder}</option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
