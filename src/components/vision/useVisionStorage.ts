import { useCallback, useEffect, useRef, useState } from "react";
import { loadVisionStorage, saveVisionStorage, type VisionStorage } from "@/lib/vision-storage";

export function useVisionStorage() {
  const [storage, setStorage] = useState<VisionStorage>(() => loadVisionStorage());
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return { storage, persist };
}
