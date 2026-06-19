import { X } from "lucide-react";
import { Btn, Field, Input } from "./ui";

export function CreateDatasetModal({
  open,
  folderName,
  onFolderNameChange,
  onClose,
  onCreate,
}: {
  open: boolean;
  folderName: string;
  onFolderNameChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-sm border border-border bg-card">
        <div className="flex items-center justify-between border-b-2 border-primary bg-surface-2 px-4 py-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Create Dataset
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4">
          <Field label="Folder Name">
            <Input
              value={folderName}
              onChange={(e) => onFolderNameChange(e.target.value)}
              placeholder="Enter folder name"
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
            />
          </Field>
          <div className="mt-4 flex justify-end gap-2">
            <Btn variant="outline" onClick={onClose}>
              Cancel
            </Btn>
            <Btn onClick={onCreate} disabled={!folderName.trim()}>
              Create
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
