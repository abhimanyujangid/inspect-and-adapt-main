import { useState } from "react";
import type { Model, Profile } from "@/lib/vision-storage";

export function useTrainedModels(
  profile: Profile,
  onUpdate: (profile: Profile) => void,
  defaultSelectedId?: string,
) {
  const models = profile.models;
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? models[0]?.id ?? "");
  const [threshold, setThreshold] = useState(models[0]?.threshold ?? "0.56");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const selected = models.find((m) => m.id === selectedId) ?? models[0];

  const selectModel = (id: string) => {
    setSelectedId(id);
    const model = models.find((m) => m.id === id);
    if (model) setThreshold(model.threshold);
  };

  const updateModels = (next: Model[]) => onUpdate({ ...profile, models: next });

  const activateModel = () => {
    if (!selected) return;
    updateModels(models.map((m) => ({ ...m, active: m.id === selected.id })));
  };

  const deactivateModel = () => {
    if (!selected) return;
    updateModels(models.map((m) => (m.id === selected.id ? { ...m, active: false } : m)));
  };

  const deleteModel = () => {
    if (!deleteId) return;
    const next = models.filter((m) => m.id !== deleteId);
    updateModels(next);
    if (selectedId === deleteId) {
      setSelectedId(next[0]?.id ?? "");
      setThreshold(next[0]?.threshold ?? "0.56");
    }
    setDeleteId(null);
  };

  const saveThreshold = () => {
    if (!selected) return;
    updateModels(models.map((m) => (m.id === selected.id ? { ...m, threshold } : m)));
  };

  return {
    models,
    selected,
    selectedId,
    threshold,
    setThreshold,
    deleteId,
    setDeleteId,
    selectModel,
    activateModel,
    deactivateModel,
    deleteModel,
    saveThreshold,
  };
}
