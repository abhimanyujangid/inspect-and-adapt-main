import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VisionApp } from "@/components/vision/VisionApp";

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
  return <VisionApp />;
}
