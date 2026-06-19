import { Field, Input } from "./ui";

export function ProfileInfoStep({
  capName,
  onCapNameChange,
}: {
  capName: string;
  onCapNameChange: (value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="rounded-sm border border-border bg-card p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">
          Profile Information
        </h2>
        <Field label="Cap Name">
          <Input value={capName} onChange={(e) => onCapNameChange(e.target.value)} />
        </Field>
      </div>
    </div>
  );
}
