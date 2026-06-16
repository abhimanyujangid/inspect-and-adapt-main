import { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "./TopBar";
import { Sidebar, type PageKey } from "./Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { AlarmPage } from "./pages/AlarmPage";
import { ProfileOverviewPage } from "./pages/ProfileOverviewPage";
import { NewProfileWizard } from "./NewProfileWizard";
import { ManageProfilesDrawer } from "./ManageProfilesDrawer";
import { RolePasswordModal } from "./RolePasswordModal";
import type { UserRole } from "@/lib/vision-constants";
import {
  activateProfile,
  finishProfile,
  loadVisionStorage,
  saveVisionStorage,
  type Profile,
  type VisionStorage,
} from "@/lib/vision-storage";

type WizardMode = "create" | "edit" | null;

export function VisionApp() {
  const [storage, setStorage] = useState<VisionStorage>(() => loadVisionStorage());
  const [page, setPage] = useState<PageKey>("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<WizardMode>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("Admin");
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [lineRunning, setLineRunning] = useState(true);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { profiles, activeProfileId } = storage;
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;
  const editingProfile = profiles.find((p) => p.id === editingProfileId) ?? null;

  const persist = useCallback((next: VisionStorage) => {
    setStorage(next);
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => saveVisionStorage(next), 300);
  }, []);

  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, []);

  const updateProfile = useCallback(
    (updated: Profile) => {
      persist({
        ...storage,
        profiles: storage.profiles.map((p) => (p.id === updated.id ? updated : p)),
      });
    },
    [storage, persist],
  );

  const requestRoleChange = (next: UserRole) => {
    if (next === role) return;
    setPendingRole(next);
  };

  const confirmRoleChange = () => {
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
        i === 0 && fallback ? { ...p, status: "active" as const } : { ...p, status: p.status === "active" ? "inactive" as const : p.status },
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

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardPage profile={activeProfile} />;
      case "alarm":
        return <AlarmPage />;
      case "profile":
        return <ProfileOverviewPage profile={activeProfile} />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        activeProfile={activeProfile}
        onNewProfile={openCreateWizard}
        onManageProfiles={openManageProfiles}
        role={role}
        onRequestRoleChange={requestRoleChange}
        lineRunning={lineRunning}
        onToggleLine={() => setLineRunning((r) => !r)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={page} onNavigate={setPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>

      {wizardOpen && (
        <NewProfileWizard
          mode={wizardMode ?? "create"}
          editingProfile={editingProfile}
          onClose={closeWizard}
          onPersist={persist}
          storage={storage}
          onSetEditingId={setEditingProfileId}
          onFinish={handleFinish}
        />
      )}

      <ManageProfilesDrawer
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onActivate={handleActivate}
        onEdit={openEditWizard}
        onDelete={handleDelete}
        readOnly={role === "Operator"}
      />

      {pendingRole && (
        <RolePasswordModal
          open={pendingRole !== null}
          targetRole={pendingRole}
          onSuccess={confirmRoleChange}
          onCancel={() => setPendingRole(null)}
        />
      )}
    </div>
  );
}
