import { cva, type VariantProps } from "class-variance-authority";
import { type InputFieldVariantProps, inputFieldVariants } from "../input/input.variants";

export const textareaExtraVariants = cva("min-h-textarea py-2");

export type TextareaVariantProps = InputFieldVariantProps &
  VariantProps<typeof textareaExtraVariants>;

export { inputFieldVariants as textareaFieldVariants };
