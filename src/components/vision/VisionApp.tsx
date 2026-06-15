import { useState } from "react";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";
import { Sidebar, type PageKey } from "./Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { AlarmPage } from "./pages/AlarmPage";
import { PlcConfigPage } from "./pages/PlcConfigPage";
import { CameraConfigPage } from "./pages/CameraConfigPage";
import { DeviceControlPage } from "./pages/DeviceControlPage";
import { DatasetsPage } from "./pages/DatasetsPage";
import { ImageCapturePage } from "./pages/ImageCapturePage";
import { GalleryPage } from "./pages/GalleryPage";
import { ModelTrainingPage } from "./pages/ModelTrainingPage";
import { ModelManagerPage } from "./pages/ModelManagerPage";
import { NewProfileWizard } from "./NewProfileWizard";
import { ManageProfilesDrawer } from "./ManageProfilesDrawer";

export type Profile = {
  id: string;
  name: string;
  product: string;
  status: "Ready" | "Training" | "Incomplete" | "Error";
  created: string;
  modified: string;
};

const SEED_PROFILES: Profile[] = [
  { id: "p1", name: "Bottle Cap V1", product: "Bottle Cap", status: "Ready", created: "2025-09-12", modified: "2026-05-30" },
  { id: "p2", name: "Bottle Cap V2", product: "Bottle Cap", status: "Ready", created: "2026-01-08", modified: "2026-06-09" },
  { id: "p3", name: "Blue Cap Inspection", product: "Blue Cap", status: "Training", created: "2026-04-22", modified: "2026-06-10" },
  { id: "p4", name: "Red Cap Inspection", product: "Red Cap", status: "Incomplete", created: "2026-05-30", modified: "2026-06-04" },
];

export function VisionApp() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState("p2");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [role, setRole] = useState<"Admin" | "Operator">("Admin");

  const activeProfile = profiles.find((p) => p.id === activeProfileId)!;

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage profile={activeProfile} />;
      case "alarm": return <AlarmPage />;
      case "plc": return <PlcConfigPage />;
      case "camera": return <CameraConfigPage />;
      case "device": return <DeviceControlPage />;
      case "datasets": return <DatasetsPage />;
      case "capture": return <ImageCapturePage />;
      case "gallery": return <GalleryPage />;
      case "training": return <ModelTrainingPage />;
      case "models": return <ModelManagerPage />;
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <TopBar
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfileId}
        onNewProfile={() => setWizardOpen(true)}
        onManageProfiles={() => setManageOpen(true)}
        role={role}
        onToggleRole={() => setRole((r) => (r === "Admin" ? "Operator" : "Admin"))}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar current={page} onNavigate={setPage} />
        <main className={cn("flex-1", page === "camera" || page === "plc" ? "overflow-hidden" : "overflow-auto")}>
          {renderPage()}
        </main>
      </div>

      {wizardOpen && (
        <NewProfileWizard
          onClose={() => setWizardOpen(false)}
          onCreate={(p) => {
            setProfiles((prev) => [...prev, p]);
            setActiveProfileId(p.id);
            setWizardOpen(false);
          }}
        />
      )}

      <ManageProfilesDrawer
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onActivate={setActiveProfileId}
        onDelete={(id) => setProfiles((p) => p.filter((x) => x.id !== id))}
      />
    </div>
  );
}
