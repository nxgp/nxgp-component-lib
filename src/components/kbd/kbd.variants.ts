import { cva, type VariantProps } from "class-variance-authority";

export const kbdVariants = cva(
  "pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center gap-1 rounded border border-border bg-muted px-1.5 align-middle font-mono text-meta font-medium leading-none text-muted-foreground",
);

export type KbdVariantProps = VariantProps<typeof kbdVariants>;
