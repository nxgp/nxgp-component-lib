import type { ReactNode } from "react";
import { Label } from "../../src/components/label";

/** Checkbox / switch field with a visible label for playground stories. */
export function labeledField(
  id: string,
  label: string,
  control: ReactNode,
  className = "flex items-center gap-2",
) {
  return (
    <div className={className}>
      {control}
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

/** Centered canvas with padding for overlay triggers (dialog, popover, menu). */
export function overlayCanvasDecorator(Story: () => ReactNode) {
  return (
    <div className="flex min-h-48 w-full items-center justify-center p-8">
      <Story />
    </div>
  );
}
