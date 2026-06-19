import { ChevronDown } from "lucide-react";
import { Field, Select } from "./ui";

export function GallerySelectionBar({
  datasets,
  datasetId,
  imageCount,
  selectedCount,
  readOnly,
  onDatasetChange,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
}: {
  datasets: { id: string; name: string }[];
  datasetId: string;
  imageCount: number;
  selectedCount: number;
  readOnly?: boolean;
  onDatasetChange: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
}) {
  const currentName = datasets.find((d) => d.id === datasetId)?.name ?? "—";

  return (
    <>
      <div className="flex items-end gap-4">
        <Field label="Select Dataset">
          <div className="relative w-56">
            <Select
              value={datasetId}
              onChange={(e) => onDatasetChange(e.target.value)}
              className="pr-8"
            >
              {datasets.length === 0 && <option value="">No datasets</option>}
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          </div>
        </Field>
        <div className="pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {currentName} · {imageCount} images
        </div>
      </div>

      {!readOnly && imageCount > 0 && (
        <div className="mt-4 flex items-center justify-between border-b border-border pb-2">
          <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
            <button
              onClick={onSelectAll}
              className="text-primary underline underline-offset-2"
            >
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              className="text-primary underline underline-offset-2"
            >
              Deselect All
            </button>
          </div>
          <button
            onClick={onDeleteSelected}
            className="text-[10px] font-bold uppercase tracking-wider text-destructive underline underline-offset-2 disabled:opacity-40"
            disabled={selectedCount === 0}
          >
            Delete Selected
          </button>
        </div>
      )}
    </>
  );
}
