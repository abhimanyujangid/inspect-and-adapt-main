import { useState } from "react";
import { createId, mockCaptureDataUrl, type Profile } from "@/lib/vision-storage";

export const CAPTURE_CAMERA_OPTIONS = ["Camera 1", "Camera 2"];

export function useImageCapture(profile: Profile, onUpdate: (profile: Profile) => void) {
  const [count, setCount] = useState(1);
  const [selectedDatasetId, setSelectedDatasetId] = useState(profile.datasets[0]?.id ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [capturing, setCapturing] = useState(false);

  const datasets = profile.datasets;
  const selectedDataset = datasets.find((d) => d.id === selectedDatasetId);
  const capturedImages = selectedDataset?.images ?? [];

  const handleCreateDataset = () => {
    const name = folderName.trim();
    if (!name) return;
    const newDataset = { id: createId("dataset"), name, images: [] };
    onUpdate({ ...profile, datasets: [...datasets, newDataset] });
    setSelectedDatasetId(newDataset.id);
    setFolderName("");
    setModalOpen(false);
  };

  const startCapturing = async () => {
    if (!selectedDatasetId || capturing) return;
    const n = Math.max(1, count || 1);
    setCapturing(true);

    let currentDatasets = datasets;
    for (let i = 0; i < n; i++) {
      const label = `batch_${Date.now()}_${i + 1}.jpg`;
      const image = {
        id: createId("img"),
        name: label,
        dataUrl: mockCaptureDataUrl(label),
        capturedAt: new Date().toISOString(),
      };
      currentDatasets = currentDatasets.map((d) =>
        d.id === selectedDatasetId ? { ...d, images: [...d.images, image] } : d,
      );
      onUpdate({ ...profile, datasets: currentDatasets });
      await new Promise((r) => setTimeout(r, 250));
    }

    setCapturing(false);
  };

  return {
    count,
    setCount,
    selectedDatasetId,
    setSelectedDatasetId,
    modalOpen,
    setModalOpen,
    folderName,
    setFolderName,
    capturing,
    datasets,
    selectedDataset,
    capturedImages,
    handleCreateDataset,
    startCapturing,
  };
}
