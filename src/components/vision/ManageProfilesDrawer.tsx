import { useState } from "react";
import { X } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "./ConfirmModal";
import { ProfileManagementTable } from "./ProfileManagementTable";
import { Btn } from "./ui";

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
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[600px] max-w-full flex-col border-l border-border bg-sidebar",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex h-10 shrink-0 items-center justify-between border-b-2 border-primary bg-surface-2 px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
            Profile Management · {profiles.length}
          </span>
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4">
          <ProfileManagementTable
            profiles={profiles}
            activeProfileId={activeProfileId}
            readOnly={readOnly}
            onActivate={onActivate}
            onEdit={onEdit}
            onDelete={setDeleteId}
          />
        </div>

        <footer className="flex h-10 shrink-0 items-center justify-between border-t border-border px-4">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
            {readOnly
              ? "View only — operator mode"
              : "Edit to reopen wizard · Activate to switch profile"}
          </span>
          <Btn variant="outline" onClick={onClose}>
            Close
          </Btn>
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
