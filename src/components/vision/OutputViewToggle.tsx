import type { OutputViewMode } from "@/lib/vision-mock-data";
import { SegmentedToggle } from "./SegmentedToggle";

export function OutputViewToggle({
  value,
  onChange,
}: {
  value: OutputViewMode;
  onChange: (mode: OutputViewMode) => void;
}) {
  return (
    <SegmentedToggle
      value={value}
      onChange={onChange}
      options={[
        { value: "current", label: "Current" },
        { value: "history", label: "Last 50" },
      ]}
    />
  );
}
