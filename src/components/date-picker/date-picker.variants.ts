import { cva, type VariantProps } from "class-variance-authority";

/** Popover panel sizing for date pickers. */
export const datePickerContentVariants = cva("w-auto p-0");

export type DatePickerContentVariantProps = VariantProps<typeof datePickerContentVariants>;
