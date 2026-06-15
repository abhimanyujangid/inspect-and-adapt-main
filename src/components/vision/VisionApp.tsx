import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";
import { Sidebar, type PageKey } from "./Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { AlarmPage } from "./pages/AlarmPage";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import { ModelManagerPage } from "./pages/ModelManagerPage";
import { NewProfileWizard } from "./NewProfileWizard";
import { ManageProfilesDrawer } from "./ManageProfilesDrawer";
import {
  activateProfile,
  finishProfile,
  loadVisionStorage,
  saveVisionStorage,
  type Profile,
  type VisionStorage,
} from "@/lib/vision-storage";

type WizardMode = "create" | "edit" | null;

const SETUP_PAGES: PageKey[] = ["plc", "camera", "capture", "gallery", "training", "models"];

export function VisionApp() {
  const [storage, setStorage] = useState<VisionStorage>(() => loadVisionStorage());
  const [page, setPage] = useState<PageKey>("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardMode, setWizardMode] = useState<WizardMode>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [role, setRole] = useState<"Admin" | "Operator">("Admin");
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { profiles, activeProfileId } = storage;
  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;
  const editingProfile = profiles.find((p) => p.id === editingProfileId) ?? null;
  const isReadOnly = !wizardOpen && activeProfile?.status === "active";

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

  const openCreateWizard = () => {
    setWizardMode("create");
    setEditingProfileId(null);
    setWizardOpen(true);
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

  const profileProps = (profile: Profile) => ({
    profile,
    readOnly: isReadOnly,
    onUpdate: updateProfile,
  });

  const renderPage = () => {
    if (!activeProfile && SETUP_PAGES.includes(page)) {
      return (
        <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          No active profile. Create or activate a profile to view this page.
        </div>
      );
    }

    switch (page) {
      case "dashboard":
        return <DashboardPage profile={activeProfile} />;
      case "alarm":
        return <AlarmPage />;
      case "plc":
        return activeProfile ? <PlcConfigPage {...profileProps(activeProfile)} /> : null;
      case "camera":
        return activeProfile ? <CameraConfigPage {...profileProps(activeProfile)} /> : null;
      case "capture":
        return activeProfile ? <ImageCapturePage {...profileProps(activeProfile)} /> : null;
      case "gallery":
        return activeProfile ? <GalleryPage {...profileProps(activeProfile)} /> : null;
      case "training":
        return activeProfile ? <ModelTrainingPage {...profileProps(activeProfile)} /> : null;
      case "models":
        return activeProfile ? <ModelManagerPage {...profileProps(activeProfile)} /> : null;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        activeProfile={activeProfile}
        onNewProfile={openCreateWizard}
        onManageProfiles={() => setManageOpen(true)}
        role={role}
        onToggleRole={() => setRole((r) => (r === "Admin" ? "Operator" : "Admin"))}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={page} onNavigate={setPage} />
        <main
          className={cn(
            "flex-1",
            page === "camera" || page === "plc" || page === "models" ? "overflow-hidden" : "overflow-auto",
          )}
        >
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
      />
    </div>
  );
}
