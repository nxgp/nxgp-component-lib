import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Button, type ButtonProps } from "../button";

type IconButtonSize = Extract<ButtonProps["size"], "icon" | "icon-xs" | "icon-sm" | "icon-lg">;

export type IconButtonProps = Omit<ButtonProps, "size"> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Accessible name — required when no visible text. */
    "aria-label": string;
    /** Icon button size preset. @default "icon" */
    size?: IconButtonSize;
  };

/**
 * Icon-only button — enforces `aria-label` with icon size presets and loading support.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", size = "icon", ...props }, ref) => (
    <Button ref={ref} variant={variant} size={size} {...props} />
  ),
);

IconButton.displayName = "IconButton";
