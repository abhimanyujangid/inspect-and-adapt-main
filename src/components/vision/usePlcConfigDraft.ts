import { useEffect, useState } from "react";
import {
  activatePlc,
  createEmptyPlcConfig,
  type PlcConfiguration,
  type Profile,
} from "@/lib/vision-storage";

export function usePlcConfigDraft(profile: Profile, onUpdate: (profile: Profile) => void) {
  const [draft, setDraft] = useState<PlcConfiguration>(createEmptyPlcConfig());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const configs = profile.plcConfigurations;

  useEffect(() => {
    if (configs.length > 0 && !selectedId && !isNew) {
      selectConfig(configs[0]);
    }
  }, [configs.length]);

  const selectConfig = (config: PlcConfiguration) => {
    setDraft({ ...config, params: { ...config.params } });
    setSelectedId(config.id);
    setIsNew(false);
    setConnected(false);
  };

  const startNew = () => {
    setDraft(createEmptyPlcConfig());
    setSelectedId(null);
    setIsNew(true);
    setConnected(false);
  };

  const updateField = <K extends keyof PlcConfiguration>(key: K, value: PlcConfiguration[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateParam = (key: keyof PlcConfiguration["params"], value: string) => {
    setDraft((prev) => ({
      ...prev,
      params: { ...prev.params, [key]: value },
    }));
  };

  const persistDraft = () => {
    const toSave: PlcConfiguration =
      isNew && configs.length === 0 ? { ...draft, active: true } : draft;

    if (isNew) {
      onUpdate({ ...profile, plcConfigurations: [...configs, toSave] });
      setDraft(toSave);
      setSelectedId(toSave.id);
      setIsNew(false);
    } else {
      onUpdate({
        ...profile,
        plcConfigurations: configs.map((c) => (c.id === draft.id ? draft : c)),
      });
    }
  };

  const handleActivatePlc = (plcId: string) => {
    onUpdate({ ...profile, plcConfigurations: activatePlc(configs, plcId) });
    if (draft.id === plcId) {
      setDraft((prev) => ({ ...prev, active: true }));
    } else {
      setDraft((prev) => ({ ...prev, active: false }));
    }
  };

  const handleDeactivatePlc = (plcId: string) => {
    onUpdate({
      ...profile,
      plcConfigurations: configs.map((c) => (c.id === plcId ? { ...c, active: false } : c)),
    });
    if (draft.id === plcId) {
      setDraft((prev) => ({ ...prev, active: false }));
    }
  };

  const applyPlc = () => {
    persistDraft();
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  return {
    draft,
    configs,
    selectedId,
    isNew,
    connected,
    applied,
    setConnected,
    selectConfig,
    startNew,
    updateField,
    updateParam,
    persistDraft,
    handleActivatePlc,
    handleDeactivatePlc,
    applyPlc,
  };
}
