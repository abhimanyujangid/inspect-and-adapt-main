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

      <div className="p-5">
        <div className="flex items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Select Dataset</span>
            <div className="relative">
              <select
                value={datasetId}
                onChange={(e) => { setDatasetId(e.target.value); setSelected(new Set()); }}
                className="h-8 w-56 appearance-none rounded-sm border border-border bg-input pl-3 pr-8 text-[11px] font-bold"
              >
                {datasets.length === 0 && <option value="">No datasets</option>}
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>
          <div className="pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {currentDataset?.name ?? "—"} · {images.length} images
          </div>
        </div>

        {!readOnly && images.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-b border-border pb-2">
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <button onClick={() => setSelected(new Set(images.map((i) => i.id)))} className="text-primary underline underline-offset-2">
                Select All
              </button>
              <button onClick={() => setSelected(new Set())} className="text-primary underline underline-offset-2">
                Deselect All
              </button>
            </div>
            <button
              onClick={() => selected.size > 0 && setConfirmDelete(true)}
              className="text-[10px] font-bold uppercase tracking-wider text-destructive underline underline-offset-2 disabled:opacity-40"
              disabled={selected.size === 0}
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Image grid — maps to QGridLayout with QLabel items */}
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.length === 0 && (
            <p className="col-span-5 py-10 text-center text-[11px] text-muted-foreground">
              No images in this dataset yet.
            </p>
          )}
          {images.map((img) => {
            const isSel = selected.has(img.id);
            return (
              <button
                key={img.id}
                onClick={() => toggle(img.id)}
                className="overflow-hidden border border-border bg-card text-left rounded-sm hover:border-primary"
              >
                <div className="relative flex h-36 items-center justify-center bg-[#111318]">
                  <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
                  {!readOnly && (
                    <div className={cn(
                      "absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-sm border-2",
                      isSel ? "border-primary bg-primary" : "border-muted-foreground/50 bg-card/20",
                    )}>
                      {isSel && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between bg-surface-2 px-2 py-1.5 text-[10px]">
                  <span className="truncate font-bold text-foreground">{img.name}</span>
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
