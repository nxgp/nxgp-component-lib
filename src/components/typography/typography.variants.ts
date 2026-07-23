import { cva, type VariantProps } from "class-variance-authority";

export const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-3xl font-semibold tracking-tight text-foreground",
      h2: "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
      h3: "scroll-m-20 text-xl font-medium tracking-tight text-foreground",
      h4: "scroll-m-20 text-lg font-medium tracking-tight text-foreground",
      p: "text-sm leading-relaxed text-foreground",
      lead: "text-base text-muted-foreground",
      large: "text-base font-medium text-foreground",
      small: "text-meta font-medium leading-none text-foreground",
      meta: "text-meta leading-normal text-muted-foreground",
      muted: "text-meta text-muted-foreground",
      blockquote: "border-l-2 border-border-subtle pl-4 text-sm italic text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export const typographyElementMap = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  large: "div",
  small: "small",
  meta: "p",
  muted: "p",
  blockquote: "blockquote",
} as const;
