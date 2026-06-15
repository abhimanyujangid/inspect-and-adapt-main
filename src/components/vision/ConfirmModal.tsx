import { X } from "lucide-react";
import { Btn } from "./ui";

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={onCancel}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex justify-end gap-2">
            <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
            <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm}>
              {confirmLabel}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
