import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import {
  type TypographyVariantProps,
  typographyElementMap,
  typographyVariants,
} from "./typography.variants";

export type TypographyProps = HTMLAttributes<HTMLElement> & TypographyVariantProps;

/**
 * Semantic text styles mapped to design tokens.
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Page title</Typography>
 * <Typography variant="muted">Supporting copy</Typography>
 * ```
 */
export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "p", ...props }, ref) => {
    const Comp = typographyElementMap[variant ?? "p"];
    return (
      <Comp
        ref={ref as never}
        className={cn(typographyVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";

/** @example `<Typography variant="h1">Title</Typography>` */
export const H1 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="h1" {...props} />
));
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="h2" {...props} />
));
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="h3" {...props} />
));
H3.displayName = "H3";

export const H4 = forwardRef<HTMLHeadingElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="h4" {...props} />
));
H4.displayName = "H4";

export const Lead = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="lead" {...props} />,
);
Lead.displayName = "Lead";

export const Muted = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="muted" {...props} />,
);
Muted.displayName = "Muted";

export const Small = forwardRef<HTMLElement, Omit<TypographyProps, "variant">>((props, ref) => (
  <Typography ref={ref} variant="small" {...props} />
));
Small.displayName = "Small";

export const Meta = forwardRef<HTMLParagraphElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="meta" {...props} />,
);
Meta.displayName = "Meta";

export const Blockquote = forwardRef<HTMLQuoteElement, Omit<TypographyProps, "variant">>(
  (props, ref) => <Typography ref={ref} variant="blockquote" {...props} />,
);
Blockquote.displayName = "Blockquote";
