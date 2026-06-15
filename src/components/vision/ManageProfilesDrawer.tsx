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
}: {
  open: boolean;
  onClose: () => void;
  profiles: Profile[];
  activeProfileId: string;
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
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
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[640px] max-w-full flex-col border-l border-border bg-sidebar shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Profile Management</div>
            <div className="text-sm font-semibold">Manage Profiles · {profiles.length}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold">Profile</th>
                <th className="py-2 text-left font-semibold">Status</th>
                <th className="py-2 text-right font-semibold">Created</th>
                <th className="py-2 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const statusTone = {
                  active: "text-success",
                  pending: "text-warning",
                  inactive: "text-muted-foreground",
                }[p.status];
                return (
                  <tr key={p.id} className={cn("border-b border-border/50 hover:bg-surface", isActive && "bg-primary/5")}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {isActive && <Check className="h-3.5 w-3.5 text-primary" />}
                        <div>
                          <div className="font-medium">{p.capName}</div>
                          <div className="text-[11px] text-muted-foreground font-mono-tabular">
                            {p.id.slice(0, 20)}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                        <span className={cn("h-2 w-2 rounded-full bg-current", statusTone)} />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs font-mono-tabular text-muted-foreground">
                      {p.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {!isActive && (
                          <Btn variant="outline" className="h-7 px-2" onClick={() => onActivate(p.id)}>
                            Activate
                          </Btn>
                        )}
                        <IconBtn title="Edit" onClick={() => onEdit(p.id)}>
                          <Edit className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Delete" danger onClick={() => setDeleteId(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {profiles.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No profiles yet. Create one with + New Profile.</p>
          )}
        </div>

        <footer className="flex h-14 shrink-0 items-center justify-between border-t border-border px-4 text-xs text-muted-foreground">
          <span>Use Edit to reopen the profile wizard. Activate to switch the active profile.</span>
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
        "flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition hover:text-foreground hover:bg-surface-2",
        danger && "hover:border-destructive hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}
