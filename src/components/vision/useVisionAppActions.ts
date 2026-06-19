import { useState } from "react";
import type { UserRole } from "@/lib/vision-constants";
import {
  activateProfile,
  finishProfile,
  type VisionStorage,
} from "@/lib/vision-storage";

type WizardMode = "create" | "edit" | null;

export function useVisionAppActions(
  storage: VisionStorage,
  persist: (next: VisionStorage) => void,
  role: UserRole,
) {
  const [page, setPage] = useState<"dashboard" | "alarm" | "profile">("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<WizardMode>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [lineRunning, setLineRunning] = useState(true);

  const { profiles, activeProfileId } = storage;
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;
  const editingProfile = profiles.find((p) => p.id === editingProfileId) ?? null;

  const requestRoleChange = (next: UserRole) => {
    if (next !== role) setPendingRole(next);
  };

  const confirmRoleChange = (setRole: (role: UserRole) => void) => {
    if (pendingRole) setRole(pendingRole);
    setPendingRole(null);
  };

  const openCreateWizard = () => {
    if (role !== "Admin") return;
    setWizardMode("create");
    setEditingProfileId(null);
    setWizardOpen(true);
  };

  const openManageProfiles = () => {
    if (role !== "Admin") return;
    setManageOpen(true);
  };

  const openEditWizard = (profileId: string) => {
    setWizardMode("edit");
    setEditingProfileId(profileId);
    setWizardOpen(true);
    setManageOpen(false);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setWizardMode(null);
    setEditingProfileId(null);
  };

  const handleActivate = (profileId: string) => {
    persist({
      ...storage,
      profiles: activateProfile(storage.profiles, profileId),
      activeProfileId: profileId,
    });
  };

  const handleDelete = (profileId: string) => {
    const remaining = storage.profiles.filter((p) => p.id !== profileId);
    let nextActiveId = storage.activeProfileId;
    let nextProfiles = remaining;

    if (profileId === storage.activeProfileId) {
      const fallback = remaining[0];
      nextActiveId = fallback?.id ?? "";
      nextProfiles = remaining.map((p, i) =>
        i === 0 && fallback
          ? { ...p, status: "active" as const }
          : {
              ...p,
              status: p.status === "active" ? ("inactive" as const) : p.status,
            },
      );
    }

    persist({ profiles: nextProfiles, activeProfileId: nextActiveId });
  };

  const handleFinish = (profileId: string) => {
    persist({
      profiles: finishProfile(storage.profiles, profileId),
      activeProfileId: profileId,
    });
    closeWizard();
  };

  return {
    page,
    setPage,
    wizardOpen,
    wizardMode,
    editingProfile,
    editingProfileId,
    setEditingProfileId,
    manageOpen,
    setManageOpen,
    pendingRole,
    setPendingRole,
    lineRunning,
    setLineRunning,
    activeProfile,
    profiles,
    activeProfileId,
    requestRoleChange,
    confirmRoleChange,
    openCreateWizard,
    openManageProfiles,
    openEditWizard,
    closeWizard,
    handleActivate,
    handleDelete,
    handleFinish,
  };
}
