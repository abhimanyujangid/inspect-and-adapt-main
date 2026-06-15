import { useState } from "react";
import { PageHeader, Btn, Badge } from "../ui";
import { Plus, Camera, RefreshCw, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

type DatasetStatus = "Trained" | "Ready" | "Collecting";

type Dataset = {
  id: string;
  name: string;
  status: DatasetStatus;
  capType: string;
  images: number;
};

const SEED_DATASETS: Dataset[] = [
  { id: "d1", name: "Blue Caps Batch 1", status: "Trained", capType: "Cap Type", images: 128 },
  { id: "d2", name: "Red Caps Line B", status: "Ready", capType: "Cap Type", images: 64 },
  { id: "d3", name: "Test Set March", status: "Collecting", capType: "Cap Type", images: 32 },
];

const STATUS_TONE: Record<DatasetStatus, "success" | "warning" | "default"> = {
  Trained: "success",
  Ready: "warning",
  Collecting: "default",
};

export function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>(SEED_DATASETS);
  const [activeId, setActiveId] = useState("d1");

  const handleDelete = (id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    if (activeId === id) setActiveId("");
  };

  const handleToggleActive = (id: string) => {
    setActiveId((current) => (current === id ? "" : id));
  };

  return (
    <>
      <PageHeader
        title="Datasets"
        subtitle="Registered training datasets"
        actions={
          <Btn>
            <Plus className="h-3.5 w-3.5" />
            Create New Dataset
          </Btn>
        }
      />

      <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        {datasets.map((dataset) => {
          const isActive = activeId === dataset.id;
          return (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              isActive={isActive}
              onDelete={() => handleDelete(dataset.id)}
              onToggleActive={() => handleToggleActive(dataset.id)}
            />
          );
        })}
      </div>
    </>
  );
}

function DatasetCard({
  dataset,
  isActive,
  onDelete,
  onToggleActive,
}: {
  dataset: Dataset;
  isActive: boolean;
  onDelete: () => void;
  onToggleActive: () => void;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">{dataset.name}</h2>
        <Badge tone={STATUS_TONE[dataset.status]}>{dataset.status}</Badge>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">{dataset.capType}</p>
          <p className="font-medium text-foreground">{dataset.images} Images</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              isActive ? "bg-success" : "bg-destructive",
            )}
          />
          <span className="font-medium text-foreground">
            {isActive ? "Active" : "In Active"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Btn variant="outline" className="h-8 flex-1 px-2 text-xs">
            <Camera className="h-3.5 w-3.5" />
            Capture
          </Btn>
          <Btn variant="outline" className="h-8 flex-1 px-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Train
          </Btn>
          <button
            onClick={onDelete}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-destructive text-destructive-foreground transition hover:bg-destructive/90"
            aria-label={`Delete ${dataset.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <button
          onClick={onToggleActive}
          className={cn(
            "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-semibold transition",
            isActive
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          <Save className="h-4 w-4" />
          {isActive ? "Set In Active" : "Set Active"}
        </button>
      </div>
    </article>
  );
}
