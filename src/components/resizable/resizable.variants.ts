import { cva, type VariantProps } from "class-variance-authority";

export const resizablePanelGroupVariants = cva("flex h-full w-full");

export const resizablePanelVariants = cva("flex h-full w-full flex-col");

export const resizableHandleVariants = cva(
  "group/separator relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0",
);

export const resizableHandleGripVariants = cva(
  "z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-border bg-background group-aria-[orientation=horizontal]/separator:h-3 group-aria-[orientation=horizontal]/separator:w-4",
);

export const resizableHandleGripIconVariants = cva(
  "size-2.5 text-muted-foreground group-aria-[orientation=horizontal]/separator:rotate-90",
);

export type ResizableVariantProps = VariantProps<typeof resizablePanelGroupVariants>;
