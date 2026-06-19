import { useState } from "react";
import { createId, type Profile } from "@/lib/vision-storage";

function time() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

export function useModelTraining(profile: Profile, onUpdate: (profile: Profile) => void) {
  const [label, setLabel] = useState("Test Model");
  const [datasetId, setDatasetId] = useState(profile.datasets[0]?.id ?? "");
  const [backbone, setBackbone] = useState("PatchCore");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [training, setTraining] = useState(false);

  const trainModel = () => {
    if (!datasetId || !label.trim()) return;
    setTraining(true);
    setProgress(10);
    setLogs([`${time()} - Loading dataset...`, `${time()} - Preprocessing images...`]);

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 15, 100);
        if (next >= 100) {
          clearInterval(interval);
          const model = {
            id: createId("model"),
            name: label.trim(),
            datasetId,
            status: "trained" as const,
            active: false,
            threshold: "0.56",
          };
          onUpdate({ ...profile, models: [...profile.models, model] });
          setLogs((prev) => [...prev, `${time()} - Training complete. Model saved.`]);
          setTraining(false);
        }
        return next;
      });
    }, 400);
  };

  return {
    label,
    setLabel,
    datasetId,
    setDatasetId,
    backbone,
    setBackbone,
    progress,
    logs,
    training,
    datasets: profile.datasets,
    trainModel,
  };
}
