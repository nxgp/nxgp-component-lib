import { cva, type VariantProps } from "class-variance-authority";
import { focusRing, formFieldMotion } from "../../lib/interactive.variants";

export const uploadDropzoneVariants = cva(
  `flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center text-sm text-muted-foreground ${formFieldMotion} ${focusRing}`,
  {
    variants: {
      active: {
        true: "border-primary bg-primary/5 text-foreground",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export type UploadDropzoneVariantProps = VariantProps<typeof uploadDropzoneVariants>;

export const uploadFileThumbnailVariants = cva(
  "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border-subtle bg-muted/40",
);
