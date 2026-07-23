import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { Separator } from "../separator/separator";
import { type ButtonGroupVariantProps, buttonGroupVariants } from "./button-group.variants";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> &
  ButtonGroupVariantProps & {
    /** Accessible label for the group. */
    "aria-label"?: string;
  };

/**
 * Groups related buttons with merged borders and shared focus stacking.
 *
 * @example
 * ```tsx
 * <ButtonGroup aria-label="Text formatting">
 *   <Button variant="outline">Bold</Button>
 *   <Button variant="outline">Italic</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, role = "group", ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      data-slot="button-group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  ),
);
ButtonGroup.displayName = "ButtonGroup";

export type ButtonGroupTextProps = HTMLAttributes<HTMLSpanElement>;

/** Static label segment inside a {@link ButtonGroup}. */
export const ButtonGroupText = forwardRef<HTMLSpanElement, ButtonGroupTextProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="button-group-text"
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted px-3 text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
ButtonGroupText.displayName = "ButtonGroupText";

export type ButtonGroupSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  /** Divider orientation inside the group. @default "vertical" */
  orientation?: "horizontal" | "vertical";
};

/** Divider between grouped controls. */
export const ButtonGroupSeparator = forwardRef<HTMLDivElement, ButtonGroupSeparatorProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <Separator
      ref={ref}
      data-slot="button-group-separator"
      orientation={orientation}
      decorative
      className={cn(
        "!m-0 shrink-0 self-stretch bg-border",
        orientation === "vertical" ? "w-px" : "h-px",
        className,
      )}
      {...props}
    />
  ),
);
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";
