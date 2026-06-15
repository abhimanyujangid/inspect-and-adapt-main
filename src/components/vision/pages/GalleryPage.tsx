import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PageHeader } from "../ui";
import { cn } from "@/lib/utils";

const IMAGES = Array.from({ length: 15 }, (_, i) => `Cap_0${127 + i}.png`);

export function GalleryPage() {
  const [dataset, setDataset] = useState("dataset_a");
  const [selected, setSelected] = useState<Set<string>>(new Set(["Cap_0132.png"]));

  const toggle = (n: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Training image browser — backend pending"
      />

      <div className="p-6">
      <div className="flex items-end gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Select Dataset</span>
          <div className="relative">
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="h-12 w-64 appearance-none rounded-md border border-border bg-card pl-4 pr-10 text-sm font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value="dataset_a">dataset_a</option>
              <option value="dataset_b">dataset_b</option>
              <option value="dataset_c">dataset_c</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </label>
        <div className="pb-3 text-sm text-muted-foreground">Viewing images for: {dataset}</div>
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-border pb-3">
        <div className="flex gap-6 text-sm font-medium underline-offset-4">
          <button onClick={() => setSelected(new Set(IMAGES))} className="text-foreground underline hover:text-primary">
            Select All
          </button>
          <button onClick={() => setSelected(new Set())} className="text-foreground underline hover:text-primary">
            Deselect All
          </button>
        </div>
        <button className="text-sm font-semibold text-destructive underline underline-offset-4 hover:opacity-80">
          Delete Selected Files
        </button>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-5">
        {IMAGES.map((name) => {
          const isSel = selected.has(name);
          return (
            <button
              key={name}
              onClick={() => toggle(name)}
              className="overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition hover:border-primary"
            >
              <div className="relative flex h-44 items-center justify-center bg-[oklch(0.22_0.01_250)]">
                <div className="h-20 w-20 rounded-full bg-primary" />
                <div
                  className={cn(
                    "absolute left-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded border-2 transition",
                    isSel ? "border-primary bg-primary" : "border-muted-foreground/60 bg-card/20"
                  )}
                >
                  {isSel && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                </div>
              </div>
              <div className="flex items-center justify-between bg-card px-3 py-2.5 text-sm text-foreground">
                <span>{name}</span>
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    isSel ? "border-primary bg-primary" : "border-border bg-card"
                  )}
                >
                  {isSel && <Check className="h-3 w-3 text-primary-foreground" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      </div>
    </>
  );
}
