import { Check } from "lucide-react";
import type { DatasetImage } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";

export function GalleryImageTile({
  image,
  selected,
  readOnly,
  onToggle,
}: {
  image: DatasetImage;
  selected: boolean;
  readOnly?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="overflow-hidden rounded-sm border border-border bg-card text-left hover:border-primary"
    >
      <div className="relative flex h-36 items-center justify-center bg-[#e8eaee]">
        <img src={image.dataUrl} alt={image.name} className="h-full w-full object-cover" />
        {!readOnly && (
          <div
            className={cn(
              "absolute left-2 top-2 flex h-4 w-4 items-center justify-center rounded-sm border-2",
              selected ? "border-primary bg-primary" : "border-muted-foreground/50 bg-card/20",
            )}
          >
            {selected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between bg-surface-2 px-2 py-1.5 text-[10px]">
        <span className="truncate font-bold text-foreground">{image.name}</span>
      </div>
    </button>
  );
}
