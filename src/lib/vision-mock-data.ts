export const RECENT_INSPECTIONS = [
  { time: "10:42:18", pass: true, score: "0.12", conf: "98.4%" },
  { time: "10:42:15", pass: true, score: "0.08", conf: "99.1%" },
  { time: "10:42:12", pass: false, score: "0.67", conf: "91.2%" },
  { time: "10:42:09", pass: true, score: "0.15", conf: "97.8%" },
  { time: "10:42:06", pass: true, score: "0.11", conf: "98.6%" },
  { time: "10:42:03", pass: false, score: "0.72", conf: "88.5%" },
  { time: "10:42:00", pass: true, score: "0.09", conf: "99.0%" },
];

export const HISTORY_IMAGE_COUNT = 50;

export const HISTORY_IMAGES = Array.from({ length: HISTORY_IMAGE_COUNT }, (_, i) => {
  const n = HISTORY_IMAGE_COUNT - i;
  const mins = 42 - Math.floor(i / 10);
  const secs = 18 - (i % 10) * 2;
  return {
    index: n,
    time: `10:${String(mins).padStart(2, "0")}:${String(Math.max(secs, 0)).padStart(2, "0")}`,
    pass: i % 5 !== 2,
    score: (0.08 + (i % 7) * 0.05).toFixed(2),
  };
});

export type OutputViewMode = "current" | "history";
