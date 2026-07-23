import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  hiddenArg,
  numberArg,
  sharedArgTypes,
  textArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import { DataTable } from "./data-table";
import { samplePaymentColumns, samplePayments } from "./data-table.fixtures";

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  ...defineComponentStories(
    "TanStack Table-powered data grid with sorting, filtering, pagination, selection, and virtualization.",
    {
      loading: sharedArgTypes.loading,
      emptyMessage: textArg({
        description: "Message when no rows match filters.",
        defaultValue: "No results.",
      }),
      enablePagination: booleanArg({
        description: "Enable client-side pagination.",
        defaultValue: true,
      }),
      pageSize: numberArg("Initial rows per page when pagination is enabled.", { min: 1, max: 50 }),
      hidePagination: booleanArg({
        description: "Hide the built-in pagination footer.",
        defaultValue: false,
      }),
      enableSorting: booleanArg({
        description: "Enable column sorting.",
        defaultValue: true,
      }),
      enableFiltering: booleanArg({
        description: "Enable global text filter in the toolbar.",
        defaultValue: true,
      }),
      enableRowSelection: booleanArg({
        description: "Enable row selection checkboxes.",
        defaultValue: false,
      }),
      layout: choiceArg(["default", "flush"] as const, {
        description: "Layout preset for toolbar and pagination spacing.",
        defaultValue: "default",
      }),
      "aria-label": textArg({ description: "Accessible label for the table." }),
      columns: hiddenArg("TanStack column definitions."),
      data: hiddenArg("Row data array."),
      enableColumnVisibility: hiddenArg("Enable column visibility toggles."),
      enableColumnFilters: hiddenArg("Enable per-column text filters in the toolbar."),
      enableColumnReordering: hiddenArg("Enable drag-reorder in the column visibility menu."),
      enableVirtualization: hiddenArg("Virtualize body rows for large datasets."),
      estimateRowHeight: hiddenArg("Estimated row height when virtualizing."),
      stickyHeader: hiddenArg("Pin header while the table body scrolls."),
      filterPlaceholder: hiddenArg("Placeholder for the global filter input."),
      pageSizeOptions: hiddenArg("Page-size options for the footer selector."),
      maxHeight: hiddenArg("Max height of the scroll container (number = px)."),
      manualPagination: hiddenArg(
        "Server-side pagination — use with `pageCount` and controlled `pagination`.",
      ),
      manualSorting: hiddenArg("Server-side sorting — sorting state is controlled externally."),
      manualFiltering: hiddenArg("Server-side filtering — filter state is controlled externally."),
      hideToolbar: hiddenArg("Hide the built-in toolbar."),
      pageCount: hiddenArg("Total page count from the server when `manualPagination` is true."),
      rowCount: hiddenArg("Total row count from the server for footer display."),
      pagination: hiddenArg("Controlled pagination state for server mode."),
      onPaginationChange: hiddenArg("Called when pagination changes in server mode."),
      onRowSelectionChange: hiddenArg("Called when row selection changes."),
      onSortingChange: hiddenArg("Called when sorting changes."),
      onGlobalFilterChange: hiddenArg("Called when the global filter changes."),
      onColumnFiltersChange: hiddenArg("Called when column filters change."),
      getRowId: hiddenArg("Stable row id resolver for selection and updates."),
      sorting: hiddenArg("Controlled sorting state."),
      columnFilters: hiddenArg("Controlled column filters."),
      globalFilter: hiddenArg("Controlled global filter value."),
    },
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = playgroundStory({
  args: {
    loading: false,
    emptyMessage: "No results.",
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    enableRowSelection: false,
    pageSize: 10,
    hidePagination: false,
    layout: "default",
    "aria-label": "Payments",
  },
  render: (args) => <DataTable columns={samplePaymentColumns} data={samplePayments} {...args} />,
});

export const AllStates: Story = {
  ...storyDoc("Common states compared — default, loading, disabled, and validation."),
  render: () => (
    <div className="grid gap-8">
      <DataTable
        columns={samplePaymentColumns}
        data={samplePayments.slice(0, 4)}
        aria-label="Default table"
      />
      <DataTable columns={samplePaymentColumns} data={[]} loading aria-label="Loading table" />
      <DataTable
        columns={samplePaymentColumns}
        data={[]}
        emptyMessage="No payments found."
        aria-label="Empty table"
      />
    </div>
  ),
};

export const RowSelection: Story = {
  ...storyDoc("Row Selection example."),
  render: () => (
    <DataTable
      columns={samplePaymentColumns}
      data={samplePayments.slice(0, 6)}
      enableRowSelection
      aria-label="Selectable payments"
    />
  ),
};

export const PageSizeAndFilter: Story = {
  ...storyDoc("Page Size And Filter example."),
  render: () => (
    <DataTable
      columns={samplePaymentColumns}
      data={samplePayments}
      pageSize={5}
      pageSizeOptions={[5, 10, 20]}
      filterPlaceholder="Search payments"
      aria-label="Page size and filter"
    />
  ),
};

export const ScrollableStickyHeader: Story = {
  ...storyDoc("Scrollable Sticky Header example."),
  render: () => (
    <DataTable
      columns={samplePaymentColumns}
      data={samplePayments}
      enableRowSelection
      enablePagination={false}
      maxHeight={240}
      aria-label="Scrollable sticky header"
    />
  ),
};

export const Virtualized: Story = {
  ...storyDoc("Large option lists rendered with virtual scrolling for performance."),
  render: () => (
    <DataTable
      columns={samplePaymentColumns}
      enableVirtualization
      enablePagination={false}
      data={Array.from({ length: 100 }, (_, index) => ({
        id: String(index + 1),
        email: `user${index + 1}@example.com`,
        amount: (index + 1) * 10,
        status: "success" as const,
      }))}
      aria-label="Virtualized payments"
    />
  ),
};

export const ColumnFiltersAndReorder: Story = {
  ...storyDoc("Column Filters And Reorder example."),
  render: () => (
    <DataTable
      columns={samplePaymentColumns}
      data={samplePayments}
      enableColumnFilters
      enableColumnReordering
      aria-label="Column filters and reorder"
    />
  ),
};

export const ServerMode: Story = {
  ...storyDoc("Server Mode example."),
  render: function ServerModeStory() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const pageData = samplePayments.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );

    return (
      <DataTable
        columns={samplePaymentColumns}
        data={pageData}
        manualPagination
        pageCount={Math.ceil(samplePayments.length / pagination.pageSize)}
        rowCount={samplePayments.length}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageSizeOptions={[5, 10]}
        aria-label="Server-driven payments"
      />
    );
  },
};
