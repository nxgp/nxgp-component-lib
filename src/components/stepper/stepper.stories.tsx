import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  defineComponentStories,
  hiddenArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Button } from "../button";
import { Stepper, StepperContent, StepperItem, StepperSeparator } from "./stepper";

const STEPS = ["account", "profile", "review"] as const;

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  subcomponents: { StepperItem, StepperSeparator, StepperContent },
  ...defineComponentStories(
    "Multi-step wizard indicator for checkout, onboarding, and settings flows.",
    {
      value: textArg({ description: "Controlled active step id." }),
      steps: hiddenArg("Ordered step ids — auto-collected from StepperItem children when omitted."),
      orientation: sharedArgTypes.horizontalVertical(),
      onValueChange: hiddenArg("Called when the active step changes."),
    },
  ),
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { orientation: "horizontal" },
  render: function PlaygroundStory(args) {
    const [step, setStep] = useState<(typeof STEPS)[number]>("account");
    const stepIndex = STEPS.indexOf(step);

    return (
      <div className="max-w-xl space-y-6">
        <Stepper
          {...args}
          value={step}
          onValueChange={(value) => setStep(value as (typeof STEPS)[number])}
          steps={[...STEPS]}
        >
          <StepperItem value="account" title="Account" description="Sign in" />
          <StepperSeparator />
          <StepperItem value="profile" title="Profile" description="Your details" />
          <StepperSeparator />
          <StepperItem value="review" title="Review" description="Confirm" />
          <StepperContent value="account">Account step content</StepperContent>
          <StepperContent value="profile">Profile step content</StepperContent>
          <StepperContent value="review">Review step content</StepperContent>
        </Stepper>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={stepIndex <= 0}
            onClick={() => setStep(STEPS[Math.max(0, stepIndex - 1)] ?? "account")}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={stepIndex >= STEPS.length - 1}
            onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)] ?? "review")}
          >
            Next
          </Button>
        </div>
      </div>
    );
  },
});

const stepperDemo = (orientation: "horizontal" | "vertical", className?: string) =>
  function StepperDemo() {
    const [step, setStep] = useState<(typeof STEPS)[number]>("account");

    return (
      <Stepper
        className={className}
        orientation={orientation}
        value={step}
        onValueChange={(value) => setStep(value as (typeof STEPS)[number])}
        steps={[...STEPS]}
      >
        <StepperItem value="account" title="Account" description="Sign in" />
        <StepperSeparator />
        <StepperItem value="profile" title="Profile" description="Your details" />
        <StepperSeparator />
        <StepperItem value="review" title="Review" description="Confirm" />
        <StepperContent value="account">Account step content</StepperContent>
        <StepperContent value="profile">Profile step content</StepperContent>
        <StepperContent value="review">Review step content</StepperContent>
      </Stepper>
    );
  };

const HorizontalStepperDemo = stepperDemo("horizontal");
const VerticalStepperDemo = stepperDemo("vertical");

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="grid max-w-3xl gap-10 md:grid-cols-2">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Horizontal</p>
        <HorizontalStepperDemo />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Vertical</p>
        <VerticalStepperDemo />
      </div>
    </div>
  ),
};

const VerticalStepperStory = stepperDemo("vertical", "max-w-sm");

export const Vertical: Story = {
  ...storyDoc("Vertical layout orientation."),
  render: () => <VerticalStepperStory />,
};
