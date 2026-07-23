import type { Meta, StoryObj } from "@storybook/react";
import { booleanArg, choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { expect, userEvent, within } from "../../../.storybook/utils/interactions";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  subcomponents: { AccordionItem, AccordionTrigger, AccordionContent },
  ...defineComponentStories(
    "Vertically stacked expandable sections — single or multi-expand modes.",
    {
      type: choiceArg(["single", "multiple"] as const, {
        description: "Whether one or multiple sections can be open at a time.",
        defaultValue: "single",
      }),
      collapsible: booleanArg({
        description: "When true (single mode), the open section can be collapsed entirely.",
        defaultValue: false,
      }),
    },
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It follows WAI-ARIA design patterns.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It uses semantic design tokens.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /is it accessible/i });
    await userEvent.click(trigger);
    await expect(canvas.getByText(/WAI-ARIA design patterns/i)).toBeVisible();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("data-state", "closed");
  },
});

export const WithoutIcon: Story = {
  ...storyDoc("Example with out icon."),
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger showIcon={false}>Plain trigger (no chevron)</AccordionTrigger>
        <AccordionContent>Content without a chevron indicator on the trigger.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger showIcon={false}>Another section</AccordionTrigger>
        <AccordionContent>Same minimal trigger style.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  ...storyDoc("Accept multiple files in one selection."),
  args: { type: "multiple" },
  render: (args) => (
    <Accordion {...args} className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>Multiple sections can stay open at once.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>Open this alongside section one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Section three</AccordionTrigger>
        <AccordionContent>All three can be expanded together.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
