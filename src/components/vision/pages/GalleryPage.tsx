import { useState } from "react";
import type { ProfilePageProps } from "@/lib/vision-storage";
import { ConfirmModal } from "../ConfirmModal";
import { GalleryImageTile } from "../GalleryImageTile";
import { GallerySelectionBar } from "../GallerySelectionBar";
import { PageHeader } from "../ui";

export function GalleryPage({ profile, readOnly, onUpdate }: ProfilePageProps) {
  const datasets = profile.datasets;
  const [datasetId, setDatasetId] = useState(datasets[0]?.id ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const currentDataset = datasets.find((d) => d.id === datasetId);
  const images = currentDataset?.images ?? [];

  const toggle = (id: string) => {
    if (readOnly) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    if (!currentDataset) return;
    onUpdate({
      ...profile,
      datasets: datasets.map((d) =>
        d.id === datasetId
          ? { ...d, images: d.images.filter((img) => !selected.has(img.id)) }
          : d,
      ),
    });
    setSelected(new Set());
    setConfirmDelete(false);
  };

  return (
    <>
      <PageHeader title="Gallery" subtitle="Training image browser — backend pending" />

      <div className="p-5">
        <GallerySelectionBar
          datasets={datasets}
          datasetId={datasetId}
          imageCount={images.length}
          selectedCount={selected.size}
          readOnly={readOnly}
          onDatasetChange={(id) => {
            setDatasetId(id);
            setSelected(new Set());
          }}
          onSelectAll={() => setSelected(new Set(images.map((i) => i.id)))}
          onDeselectAll={() => setSelected(new Set())}
          onDeleteSelected={() => selected.size > 0 && setConfirmDelete(true)}
        />

        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.length === 0 && (
            <p className="col-span-5 py-10 text-center text-[11px] text-muted-foreground">
              No images in this dataset yet.
            </p>
          )}
          {images.map((img) => (
            <GalleryImageTile
              key={img.id}
              image={img}
              selected={selected.has(img.id)}
              readOnly={readOnly}
              onToggle={() => toggle(img.id)}
            />
          ))}
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete}
        title="Delete Images"
        message="Are you sure you want to delete the selected image(s)?"
        confirmLabel="Delete"
        danger
        onConfirm={deleteSelected}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
