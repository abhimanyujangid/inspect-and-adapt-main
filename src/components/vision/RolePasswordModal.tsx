import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Btn, Field, Input } from "./ui";
import { verifyRolePassword, type UserRole } from "@/lib/vision-constants";

export function RolePasswordModal({
  open,
  targetRole,
  onSuccess,
  onCancel,
}: {
  open: boolean;
  targetRole: UserRole;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPassword("");
      setError("");
    }
  }, [open, targetRole]);

  const handleVerify = () => {
    if (verifyRolePassword(password)) {
      setError("");
      onSuccess();
    } else {
      setError("Incorrect password");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm border border-border bg-card rounded-sm">
        <div className="flex items-center justify-between border-b-2 border-primary bg-surface-2 px-4 py-2.5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Switch to {targetRole}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-sm p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-muted-foreground">
            Enter password to switch role to <span className="font-bold text-foreground">{targetRole}</span>.
          </p>
          <div className="mt-4">
            <Field label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                autoFocus
              />
            </Field>
            {error && (
              <p className="mt-2 text-[10px] font-bold text-destructive">{error}</p>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Btn variant="outline" onClick={onCancel}>Cancel</Btn>
            <Btn onClick={handleVerify}>Verify</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
