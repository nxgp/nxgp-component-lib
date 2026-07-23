import type { ReactNode } from "react";
import { Badge } from "../badge/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip/tooltip";
import {
  comboboxBadgeListVariants,
  comboboxOverflowCountVariants,
  comboboxOverflowTooltipVariants,
} from "./select-search.variants";

export type ComboboxOverflowPosition = "start" | "end";

export type ComboboxMultiSelectLabelProps = {
  selectedValues: string[];
  /** Number of selected values shown as badges before collapsing the rest into +N. @default 2 */
  maxBadges?: number;
  /** Where the +N indicator appears relative to visible badges. @default "end" */
  overflowPosition?: ComboboxOverflowPosition;
  /**
   * Tooltip on the +N indicator. `true` lists hidden selections;
   * pass a node or `(hiddenValues) => node` for custom content; `false` disables the tooltip.
   * @default true
   */
  overflowTooltip?: boolean | ReactNode | ((hiddenValues: string[]) => ReactNode);
  /** Maps a selected value to badge and tooltip label text. */
  getBadgeLabel?: (value: string) => ReactNode;
};

function resolveOverflowTooltipContent(
  hiddenValues: string[],
  overflowTooltip: ComboboxMultiSelectLabelProps["overflowTooltip"],
  getBadgeLabel: (value: string) => ReactNode,
) {
  if (overflowTooltip === false) {
    return null;
  }

  if (typeof overflowTooltip === "function") {
    return overflowTooltip(hiddenValues);
  }

  if (overflowTooltip !== undefined && overflowTooltip !== true) {
    return overflowTooltip;
  }

  return (
    <ul className={comboboxOverflowTooltipVariants()}>
      {hiddenValues.map((value) => (
        <li key={value}>{getBadgeLabel(value)}</li>
      ))}
    </ul>
  );
}

type ComboboxOverflowIndicatorProps = {
  count: number;
  hiddenValues: string[];
  overflowTooltip: ComboboxMultiSelectLabelProps["overflowTooltip"];
  getBadgeLabel: (value: string) => ReactNode;
};

function ComboboxOverflowIndicator({
  count,
  hiddenValues,
  overflowTooltip,
  getBadgeLabel,
}: ComboboxOverflowIndicatorProps) {
  const indicator = (
    <span className={comboboxOverflowCountVariants()} data-slot="combobox-overflow-count">
      +{count}
    </span>
  );

  const tooltipContent = resolveOverflowTooltipContent(
    hiddenValues,
    overflowTooltip,
    getBadgeLabel,
  );

  if (!tooltipContent) {
    return indicator;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={comboboxOverflowCountVariants({ interactive: true })}
            data-slot="combobox-overflow-count"
          >
            +{count}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Default multi-select trigger label — visible badges plus optional +N overflow indicator.
 */
export function ComboboxMultiSelectLabel({
  selectedValues,
  maxBadges = 2,
  overflowPosition = "end",
  overflowTooltip = true,
  getBadgeLabel = (value) => value,
}: ComboboxMultiSelectLabelProps) {
  const visibleValues = selectedValues.slice(0, maxBadges);
  const hiddenValues = selectedValues.slice(maxBadges);
  const overflowCount = hiddenValues.length;

  const badges = visibleValues.map((value) => (
    <Badge key={value} variant="secondary">
      {getBadgeLabel(value)}
    </Badge>
  ));

  const overflowIndicator =
    overflowCount > 0 ? (
      <ComboboxOverflowIndicator
        count={overflowCount}
        hiddenValues={hiddenValues}
        overflowTooltip={overflowTooltip}
        getBadgeLabel={getBadgeLabel}
      />
    ) : null;

  return (
    <span className={comboboxBadgeListVariants()}>
      {overflowPosition === "start" ? overflowIndicator : null}
      {badges}
      {overflowPosition === "end" ? overflowIndicator : null}
    </span>
  );
}
