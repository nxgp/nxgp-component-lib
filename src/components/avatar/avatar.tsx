import { Avatar as AvatarPrimitive } from "radix-ui";
import {
  Children,
  type ComponentPropsWithoutRef,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import {
  type AvatarStatusVariantProps,
  type AvatarVariantProps,
  avatarInnerVariants,
  avatarStatusVariants,
  avatarWrapperVariants,
} from "./avatar.variants";

function splitAvatarChildren(children: ReactNode) {
  const content: ReactNode[] = [];
  let status: ReactElement<AvatarStatusProps> | null = null;

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === AvatarStatus) {
      status = child as ReactElement<AvatarStatusProps>;
    } else {
      content.push(child);
    }
  }

  return { content, status };
}

export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  AvatarVariantProps;

/**
 * User avatar with image and fallback.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/avatar.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, children, ...props }, ref) => {
    const { content, status } = splitAvatarChildren(children);

    return (
      <span className={cn(avatarWrapperVariants({ size }))}>
        <AvatarPrimitive.Root ref={ref} className={cn(avatarInnerVariants(), className)} {...props}>
          {content}
        </AvatarPrimitive.Root>
        {status
          ? cloneElement(status, {
              size: status.props.size ?? size ?? "default",
            })
          : null}
      </span>
    );
  },
);

Avatar.displayName = "Avatar";

export type AvatarImageProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square size-full rounded-full object-cover", className)}
      {...props}
    />
  ),
);

AvatarImage.displayName = "AvatarImage";

export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium",
        className,
      )}
      {...props}
    />
  ),
);

AvatarFallback.displayName = "AvatarFallback";

export type AvatarStatusProps = HTMLAttributes<HTMLSpanElement> &
  AvatarStatusVariantProps & {
    /** Accessible label for the presence state. */
    label?: string;
  };

/**
 * Presence indicator ring for {@link Avatar}.
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/u.png" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 *   <AvatarStatus status="online" label="Online" />
 * </Avatar>
 * ```
 */
export const AvatarStatus = forwardRef<HTMLSpanElement, AvatarStatusProps>(
  ({ className, status = "online", size = "default", label, ...props }, ref) => (
    <span
      ref={ref}
      role="img"
      data-slot="avatar-status"
      data-status={status}
      aria-label={label}
      className={cn(avatarStatusVariants({ status, size, className }))}
      {...props}
    />
  ),
);

AvatarStatus.displayName = "AvatarStatus";
