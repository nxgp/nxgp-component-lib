import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { cn } from "../../lib/cn";
import { CheckIcon } from "../../lib/icons";
import {
  type StepperItemVariantProps,
  type StepperVariantProps,
  stepperIndicatorVariants,
  stepperItemVariants,
  stepperSeparatorVariants,
  stepperVariants,
} from "./stepper.variants";

type StepState = "active" | "complete" | "inactive";

type StepperContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  stepIds: string[];
  orientation: "horizontal" | "vertical";
};

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepper(component: string): StepperContextValue {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error(`${component} must be used within Stepper`);
  }
  return context;
}

function getStepState(stepIds: string[], value: string | undefined, stepId: string): StepState {
  if (!value) {
    return "inactive";
  }
  const activeIndex = stepIds.indexOf(value);
  const stepIndex = stepIds.indexOf(stepId);
  if (stepIndex < 0) {
    return "inactive";
  }
  if (stepIndex < activeIndex) {
    return "complete";
  }
  if (stepIndex === activeIndex) {
    return "active";
  }
  return "inactive";
}

export type StepperProps = HTMLAttributes<HTMLDivElement> &
  StepperVariantProps & {
    value?: string;
    onValueChange?: (value: string) => void;
    /** Ordered step ids — auto-collected from {@link StepperItem} when omitted. */
    steps?: string[];
  };

/**
 * Multi-step wizard indicator — checkout, onboarding, settings flows.
 *
 * @example
 * ```tsx
 * <Stepper value={step} onValueChange={setStep} steps={["account", "profile", "done"]}>
 *   <StepperItem value="account" title="Account" />
 *   <StepperItem value="profile" title="Profile" />
 *   <StepperItem value="done" title="Review" />
 * </Stepper>
 * ```
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    { className, orientation = "horizontal", value, onValueChange, steps = [], children, ...props },
    ref,
  ) => {
    const context = useMemo(
      () => ({ value, onValueChange, stepIds: steps, orientation: orientation ?? "horizontal" }),
      [value, onValueChange, steps, orientation],
    );

    return (
      <StepperContext.Provider value={context}>
        <div
          ref={ref}
          data-slot="stepper"
          data-orientation={orientation}
          className={cn(stepperVariants({ orientation, className }))}
          {...props}
        >
          {children}
        </div>
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

export type StepperItemProps = HTMLAttributes<HTMLDivElement> &
  StepperItemVariantProps & {
    value: string;
    title: ReactNode;
    description?: ReactNode;
    /** Step index for indicator (1-based display). */
    step?: number;
  };

export const StepperItem = forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, value: stepValue, title, description, step, ...props }, ref) => {
    const { value, onValueChange, stepIds, orientation } = useStepper("StepperItem");
    const state = getStepState(stepIds, value, stepValue);
    const displayIndex = step ?? stepIds.indexOf(stepValue) + 1;

    return (
      <div
        ref={ref}
        data-slot="stepper-item"
        data-state={state}
        className={cn(
          stepperItemVariants({ state }),
          orientation === "horizontal" ? "flex-1" : "w-full",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 text-left",
            orientation === "vertical" && "w-full",
          )}
          onClick={() => onValueChange?.(stepValue)}
          aria-current={state === "active" ? "step" : undefined}
        >
          <span className={cn(stepperIndicatorVariants({ state }))} aria-hidden>
            {state === "complete" ? <CheckIcon className="size-4" /> : displayIndex}
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            {description ? (
              <span className="text-xs text-muted-foreground">{description}</span>
            ) : null}
          </span>
        </button>
      </div>
    );
  },
);
StepperItem.displayName = "StepperItem";

export type StepperSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const StepperSeparator = forwardRef<HTMLDivElement, StepperSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { orientation } = useStepper("StepperSeparator");

    return (
      <div
        ref={ref}
        data-slot="stepper-separator"
        aria-hidden
        className={cn(stepperSeparatorVariants({ orientation }), className)}
        {...props}
      />
    );
  },
);
StepperSeparator.displayName = "StepperSeparator";

export type StepperContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
};

/** Panel shown when a step is active. */
export const StepperContent = forwardRef<HTMLDivElement, StepperContentProps>(
  ({ className, value: stepValue, children, ...props }, ref) => {
    const { value, orientation } = useStepper("StepperContent");

    if (value !== stepValue) {
      return null;
    }

    return (
      <div
        ref={ref}
        data-slot="stepper-content"
        className={cn(
          "w-full",
          orientation === "horizontal"
            ? "mt-6 basis-full"
            : "mt-6 border-t border-border-subtle pt-6",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
StepperContent.displayName = "StepperContent";
