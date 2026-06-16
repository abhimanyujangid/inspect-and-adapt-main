import { useState } from "react";
import { X, Edit, Trash2, Check } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { Btn } from "./ui";
import { ConfirmModal } from "./ConfirmModal";
import { cn } from "@/lib/utils";

export function ManageProfilesDrawer({
  open,
  onClose,
  profiles,
  activeProfileId,
  onActivate,
  onEdit,
  onDelete,
  readOnly,
}: {
  open: boolean;
  onClose: () => void;
  profiles: Profile[];
  activeProfileId: string;
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Backdrop — maps to overlay widget in PySide6 */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      {/* Drawer panel — maps to QDockWidget in PySide6 */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[600px] max-w-full flex-col border-l border-border bg-sidebar",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex h-10 shrink-0 items-center justify-between border-b-2 border-primary bg-surface-2 px-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              Profile Management · {profiles.length}
            </span>
          </div>
          <button onClick={onClose} className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4">
          {/* Table — maps to QTableWidget in PySide6 */}
          <table className="w-full text-[11px]">
            <thead className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-1.5 text-left font-bold">Profile</th>
                <th className="py-1.5 text-left font-bold">Status</th>
                <th className="py-1.5 text-right font-bold">Created</th>
                <th className="py-1.5 text-right font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const statusColor = {
                  active: "text-success",
                  pending: "text-warning",
                  inactive: "text-muted-foreground",
                }[p.status];
                const ledColor = {
                  active: "bg-success",
                  pending: "bg-warning",
                  inactive: "bg-muted-foreground",
                }[p.status];
                return (
                  <tr key={p.id} className={cn("border-b border-border/50", isActive && "bg-primary/5")}>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        {isActive && <Check className="h-3 w-3 text-primary" />}
                        <div>
                          <div className="font-bold text-foreground">{p.capName}</div>
                          <div className="font-mono-tabular text-[9px] text-muted-foreground">
                            {p.id.slice(0, 20)}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                        <span className={cn("h-1.5 w-1.5 rounded-full", ledColor)} />
                        <span className={statusColor}>{p.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-mono-tabular text-[10px] text-muted-foreground">
                      {p.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-2.5 text-right">
                      {!readOnly && (
                        <div className="flex justify-end gap-1">
                          {!isActive && (
                            <Btn variant="outline" className="h-6 px-2" onClick={() => onActivate(p.id)}>
                              Activate
                            </Btn>
                          )}
                          <IconBtn title="Edit" onClick={() => onEdit(p.id)}>
                            <Edit className="h-3 w-3" />
                          </IconBtn>
                          <IconBtn title="Delete" danger onClick={() => setDeleteId(p.id)}>
                            <Trash2 className="h-3 w-3" />
                          </IconBtn>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {profiles.length === 0 && (
            <p className="py-8 text-center text-[11px] text-muted-foreground">
              No profiles yet. Create one with + New Profile.
            </p>
          )}
        </div>

        <footer className="flex h-10 shrink-0 items-center justify-between border-t border-border px-4">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            {readOnly ? "View only — operator mode" : "Edit to reopen wizard · Activate to switch profile"}
          </span>
          <Btn variant="outline" onClick={onClose}>Close</Btn>
        </footer>
      </aside>

      <ConfirmModal
        open={deleteId !== null}
        title="Delete Profile"
        message="Are you sure you want to delete this profile? All associated data will be removed."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}

function IconBtn({
  children,
  danger,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      {...rest}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-2",
        danger && "hover:border-destructive hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}
