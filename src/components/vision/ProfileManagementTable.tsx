import { Check, Edit, Trash2 } from "lucide-react";
import type { Profile } from "@/lib/vision-storage";
import { cn } from "@/lib/utils";
import { Btn } from "./ui";

function IconBtn({
  children,
  danger,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { danger?: boolean }) {
  return (
    <button
      {...rest}
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-surface text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        danger && "hover:border-destructive hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}

export function ProfileManagementTable({
  profiles,
  activeProfileId,
  readOnly,
  onActivate,
  onEdit,
  onDelete,
}: {
  profiles: Profile[];
  activeProfileId: string;
  readOnly?: boolean;
  onActivate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (profiles.length === 0) {
    return (
      <p className="py-8 text-center text-[11px] text-muted-foreground">
        No profiles yet. Create one with + New Profile.
      </p>
    );
  }

  return (
    <table className="w-full text-[11px]">
      <thead className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        <tr className="border-b border-border">
          <th className="py-1.5 text-left font-bold">Profile</th>
          <th className="py-1.5 text-left font-bold">Status</th>
          <th className="py-1.5 text-right font-bold">Created</th>
          <th className="py-1.5 text-right font-bold" />
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
            <tr
              key={p.id}
              className={cn("border-b border-border/50", isActive && "bg-primary/5")}
            >
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
                    <IconBtn title="Delete" danger onClick={() => onDelete(p.id)}>
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
  );
}
