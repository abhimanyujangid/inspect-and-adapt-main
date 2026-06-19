import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/vision-constants";
import { ManageProfilesDrawer } from "./ManageProfilesDrawer";
import { NewProfileWizard } from "./NewProfileWizard";
import { RolePasswordModal } from "./RolePasswordModal";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useVisionAppActions } from "./useVisionAppActions";
import { useVisionStorage } from "./useVisionStorage";
import { AlarmPage } from "./pages/AlarmPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfileOverviewPage } from "./pages/ProfileOverviewPage";

export function VisionApp() {
  const { storage, persist } = useVisionStorage();
  const [role, setRole] = useState<UserRole>("Admin");
  const actions = useVisionAppActions(storage, persist, role);

  const renderPage = () => {
    switch (actions.page) {
      case "dashboard":
        return <DashboardPage profile={actions.activeProfile} />;
      case "alarm":
        return <AlarmPage />;
      case "profile":
        return <ProfileOverviewPage profile={actions.activeProfile} />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        activeProfile={actions.activeProfile}
        onNewProfile={actions.openCreateWizard}
        onManageProfiles={actions.openManageProfiles}
        role={role}
        onRequestRoleChange={actions.requestRoleChange}
        lineRunning={actions.lineRunning}
        onToggleLine={() => actions.setLineRunning((r) => !r)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={actions.page} onNavigate={actions.setPage} />
        <main
          className={cn(
            "min-h-0 flex-1",
            actions.page === "dashboard" ? "overflow-hidden" : "overflow-auto",
          )}
        >
          {renderPage()}
        </main>
      </div>

      {actions.wizardOpen && (
        <NewProfileWizard
          mode={actions.wizardMode ?? "create"}
          editingProfile={actions.editingProfile}
          onClose={actions.closeWizard}
          onPersist={persist}
          storage={storage}
          onSetEditingId={actions.setEditingProfileId}
          onFinish={actions.handleFinish}
        />
      )}

      <ManageProfilesDrawer
        open={actions.manageOpen}
        onClose={() => actions.setManageOpen(false)}
        profiles={actions.profiles}
        activeProfileId={actions.activeProfileId}
        onActivate={actions.handleActivate}
        onEdit={actions.openEditWizard}
        onDelete={actions.handleDelete}
        readOnly={role === "Operator"}
      />

      {actions.pendingRole && (
        <RolePasswordModal
          open={actions.pendingRole !== null}
          targetRole={actions.pendingRole}
          onSuccess={() => actions.confirmRoleChange(setRole)}
          onCancel={() => actions.setPendingRole(null)}
        />
      )}
    </div>
  );
}
