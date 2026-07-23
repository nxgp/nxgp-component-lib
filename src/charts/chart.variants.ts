import { cva, type VariantProps } from "class-variance-authority";

/**
 * Recharts container styles — axis ticks, grid lines, and focus outlines use semantic tokens.
 */
export const chartVariants = cva(
  "relative flex justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
  {
    variants: {
      aspect: {
        video: "aspect-video",
        square: "aspect-square",
        auto: "",
      },
    },
    defaultVariants: {
      aspect: "video",
    },
  },
);

export type ChartVariantProps = VariantProps<typeof chartVariants>;
