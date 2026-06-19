import type { DatasetImage } from "@/lib/vision-storage";

export function CapturedImagesGrid({
  selectedDataset,
  capturedImages,
}: {
  selectedDataset?: { name: string };
  capturedImages: DatasetImage[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
          Captured Images
        </div>
        <span className="font-mono-tabular text-[10px] text-muted-foreground">
          {selectedDataset
            ? `${selectedDataset.name} · ${capturedImages.length} images`
            : "No dataset selected"}
        </span>
      </div>

      {capturedImages.length === 0 ? (
        <div className="mt-3 flex h-40 items-center justify-center rounded-sm border border-border bg-[#e8eaee] grid-bg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            No images captured yet
          </span>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {capturedImages.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-sm border border-border bg-card">
              <div className="flex h-28 items-center justify-center bg-[#e8eaee]">
                <img src={img.dataUrl} alt={img.name} className="h-full w-full object-cover" />
              </div>
              <div className="truncate px-2 py-1.5 font-mono-tabular text-[10px] text-muted-foreground">
                {img.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
