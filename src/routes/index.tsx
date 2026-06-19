import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StartupSplash } from "@/components/vision/StartupSplash";
import { VisionApp } from "@/components/vision/VisionApp";

const SPLASH_MS = 2000;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VisionOps — Bottle Cap Inspection" },
      {
        name: "description",
        content:
          "Industrial machine vision control surface for PLC, camera, dataset, and model lifecycle management.",
      },
      { property: "og:title", content: "VisionOps — Bottle Cap Inspection" },
      {
        property: "og:description",
        content:
          "Operator-friendly inspection control with profile-based configuration, training, and deployment.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), SPLASH_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return <StartupSplash />;
  return <VisionApp />;
}
