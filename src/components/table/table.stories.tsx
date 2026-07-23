import type { Meta, StoryObj } from "@storybook/react";
import { booleanArg, choiceArg, defineComponentStories } from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
  subcomponents: {
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
  },
  ...defineComponentStories(
    "Semantic table primitives with density, striping, and sticky column support.",
    {
      density: choiceArg(["default", "compact", "comfortable"] as const, {
        description: "Cell padding and header height preset.",
        defaultValue: "default",
      }),
      striped: booleanArg({
        description: "Alternate row backgrounds for scanability.",
        defaultValue: false,
      }),
      inset: booleanArg({
        description: "Apply inset border radius to the table.",
        defaultValue: true,
      }),
      noContainer: booleanArg({
        description: "Render only the table element without the scroll container.",
        defaultValue: false,
      }),
    },
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = playgroundStory({
  args: { density: "default", striped: false, inset: true, noContainer: false },
  render: (args) => (
    <Table {...args} aria-label="Invoices">
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
});

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="grid gap-8">
      <Table aria-label="Compact table" density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
            <TableCell>Engineer</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table aria-label="Comfortable table" density="comfortable">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Grace</TableCell>
            <TableCell>Designer</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const StripedWithStickyColumn: Story = {
  ...storyDoc("Striped With Sticky Column example."),
  render: () => (
    <div className="max-w-md">
      <Table striped aria-label="Striped sticky table">
        <TableHeader>
          <TableRow>
            <TableHead sticky="left">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead sticky="right" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Ada", "ada@example.com", "Engineer", "$120"],
            ["Grace", "grace@example.com", "Designer", "$98"],
            ["Lin", "lin@example.com", "PM", "$140"],
          ].map(([name, email, role, amount]) => (
            <TableRow key={name}>
              <TableCell sticky="left">{name}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{role}</TableCell>
              <TableCell sticky="right" className="text-right">
                {amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
