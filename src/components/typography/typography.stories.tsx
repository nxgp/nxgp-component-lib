import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { choiceArg, defineComponentStories, textArg } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { Blockquote, H1, H2, H3, H4, Lead, Muted, Small, Typography } from "./typography";

type TypographyStoryArgs = Pick<ComponentProps<typeof Typography>, "variant"> & {
  content?: string;
};

const meta = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
  subcomponents: { H1, H2, H3, H4, Lead, Muted, Small, Blockquote },
  ...defineComponentStories("Semantic text styles mapped to design tokens.", {
    variant: choiceArg(
      [
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "lead",
        "large",
        "small",
        "meta",
        "muted",
        "blockquote",
      ] as const,
      {
        description: "Semantic typography preset.",
        defaultValue: "p",
      },
    ),
    content: textArg({
      description: "Text content rendered with the selected variant.",
      defaultValue: "Body text rendered with the Typography component.",
    }),
  }),
} satisfies Meta<TypographyStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: {
    variant: "p",
    content: "Body text rendered with the Typography component.",
  },
  render: (args: TypographyStoryArgs) => (
    <Typography variant={args.variant}>{args.content}</Typography>
  ),
});

export const AllVariants: Story = {
  ...storyDoc("Side-by-side comparison of every visual variant."),
  render: () => (
    <div className="space-y-3">
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <Lead>Lead paragraph</Lead>
      <Typography>Body paragraph</Typography>
      <Small>Small label</Small>
      <Muted>Muted supporting text</Muted>
      <Blockquote>Blockquote for emphasis.</Blockquote>
    </div>
  ),
};
