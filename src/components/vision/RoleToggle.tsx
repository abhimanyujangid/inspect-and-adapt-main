import type { UserRole } from "@/lib/vision-constants";
import { SegmentedToggle } from "./SegmentedToggle";

export function RoleToggle({
  role,
  onRequestRoleChange,
}: {
  role: UserRole;
  onRequestRoleChange: (role: UserRole) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        Role:
      </span>
      <SegmentedToggle
        value={role}
        onChange={onRequestRoleChange}
        className="h-7"
        options={[
          { value: "Admin", label: "Admin" },
          { value: "Operator", label: "Operator" },
        ]}
      />
    </div>
  );
}
