import { X } from "lucide-react";
import { Btn } from "./ui";

/**
 * Confirm dialog — maps to QMessageBox in PySide6.
 * Flat, no shadow, no transitions.
 */
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm border border-border bg-card rounded-sm">
        <div className="flex items-center justify-between border-b-2 border-primary bg-surface-2 px-4 py-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-primary">{title}</h2>
          <button
            onClick={onCancel}
            className="rounded-sm p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-muted-foreground">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
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
