import { FolderPlus } from "lucide-react";
import type { ProfilePageProps } from "@/lib/vision-storage";
import { CapturedImagesGrid } from "../CapturedImagesGrid";
import { CreateDatasetModal } from "../CreateDatasetModal";
import { ImageCaptureControlsPanel } from "../ImageCaptureControlsPanel";
import { useImageCapture } from "../useImageCapture";
import { Btn, PageHeader } from "../ui";

export function ImageCapturePage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const capture = useImageCapture(profile, onUpdate);

  return (
    <>
      <PageHeader
        title="Image Capture"
        subtitle="Acquire training images — backend pending"
        actions={
          !readOnly ? (
            <Btn onClick={() => capture.setModalOpen(true)}>
              <FolderPlus className="h-3 w-3" />
              Create Dataset
            </Btn>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-5 p-5">
        <ImageCaptureControlsPanel
          readOnly={readOnly}
          count={capture.count}
          capturing={capture.capturing}
          selectedDatasetId={capture.selectedDatasetId}
          datasets={capture.datasets}
          onCountChange={capture.setCount}
          onDatasetChange={capture.setSelectedDatasetId}
          onStartCapture={capture.startCapturing}
        />
        <CapturedImagesGrid
          selectedDataset={capture.selectedDataset}
          capturedImages={capture.capturedImages}
        />
      </div>

      <CreateDatasetModal
        open={capture.modalOpen}
        folderName={capture.folderName}
        onFolderNameChange={capture.setFolderName}
        onClose={() => capture.setModalOpen(false)}
        onCreate={capture.handleCreateDataset}
      />
    </>
  );
}
