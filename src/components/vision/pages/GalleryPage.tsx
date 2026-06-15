import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PageHeader } from "../ui";
import { ConfirmModal } from "../ConfirmModal";
import type { ProfilePageProps } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

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

      <div className="p-6">
        <div className="flex items-end gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-foreground">Select Dataset</span>
            <div className="relative">
              <select
                value={datasetId}
                onChange={(e) => { setDatasetId(e.target.value); setSelected(new Set()); }}
                className="h-12 w-64 appearance-none rounded-md border border-border bg-card pl-4 pr-10 text-sm font-medium"
              >
                {datasets.length === 0 && <option value="">No datasets</option>}
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>
          <div className="pb-3 text-sm text-muted-foreground">
            Viewing images for: {currentDataset?.name ?? "—"} ({images.length} images)
          </div>
        </div>

        {!readOnly && images.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-b border-border pb-3">
            <div className="flex gap-6 text-sm font-medium underline-offset-4">
              <button onClick={() => setSelected(new Set(images.map((i) => i.id)))} className="underline hover:text-primary">
                Select All
              </button>
              <button onClick={() => setSelected(new Set())} className="underline hover:text-primary">
                Deselect All
              </button>
            </div>
            <button
              onClick={() => selected.size > 0 && setConfirmDelete(true)}
              className="text-sm font-semibold text-destructive underline underline-offset-4 hover:opacity-80 disabled:opacity-40"
              disabled={selected.size === 0}
            >
              Delete Selected Files
            </button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-5 gap-5">
          {images.length === 0 && (
            <p className="col-span-5 py-12 text-center text-sm text-muted-foreground">
              No images in this dataset yet.
            </p>
          )}
          {images.map((img) => {
            const isSel = selected.has(img.id);
            return (
              <button
                key={img.id}
                onClick={() => toggle(img.id)}
                className="overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition hover:border-primary"
              >
                <div className="relative flex h-44 items-center justify-center bg-[oklch(0.22_0.01_250)]">
                  <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                  {!readOnly && (
                    <div className={cn(
                      "absolute left-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded border-2",
                      isSel ? "border-primary bg-primary" : "border-muted-foreground/60 bg-card/20",
                    )}>
                      {isSel && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between bg-card px-3 py-2.5 text-sm">
                  <span className="truncate">{img.name}</span>
                </div>
              </button>
            );
          })}
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
