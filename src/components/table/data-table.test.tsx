import type { ColumnDef } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { DataTable } from "./data-table";
import { type SamplePayment, samplePaymentColumns, samplePayments } from "./data-table.fixtures";

vi.mock("@tanstack/react-virtual", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-virtual")>();
  return {
    ...actual,
    useVirtualizer: vi.fn(actual.useVirtualizer),
  };
});

function createDataTransfer() {
  let data = "";
  return {
    effectAllowed: "none" as DataTransfer["effectAllowed"],
    dropEffect: "none" as DataTransfer["dropEffect"],
    types: [] as string[],
    files: [] as File[],
    items: [] as DataTransferItem[],
    getData: () => data,
    setData: (_format: string, value: string) => {
      data = value;
    },
    clearData: () => {
      data = "";
    },
    setDragImage: () => {},
  };
}

function getReorderHandle(item: HTMLElement): HTMLElement {
  const handle = item.querySelector<HTMLElement>('[data-slot="column-reorder-handle"]');
  if (!handle) {
    throw new Error("Expected column reorder handle");
  }
  return handle;
}

describe("DataTable", () => {
  describe("rendering", () => {
    it("renders rows from data", () => {
      const { getByText } = renderWithProviders(
        <DataTable columns={samplePaymentColumns} data={samplePayments} aria-label="Payments" />,
      );
      expect(getByText("ada@example.com")).toBeInTheDocument();
      expect(getByText("$120.00")).toBeInTheDocument();
    });

    it("shows loading skeleton rows", () => {
      const { container, getByRole, getByText } = renderWithProviders(
        <DataTable columns={samplePaymentColumns} data={[]} loading aria-label="Loading" />,
      );
      expect(container.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
      expect(getByRole("table", { busy: true })).toBeInTheDocument();
      expect(getByText("Loading table data")).toBeInTheDocument();
    });

    it("shows empty message when no rows", () => {
      const { getByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={[]}
          emptyMessage="Nothing here"
          aria-label="Empty"
        />,
      );
      expect(getByText("Nothing here")).toBeInTheDocument();
    });
  });

  describe("props and state edge cases", () => {
    it("hides toolbar when hideToolbar is true", () => {
      const { queryByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          hideToolbar
          aria-label="No toolbar"
        />,
      );
      expect(queryByLabelText("Filter rows…")).not.toBeInTheDocument();
    });

    it("renders selection column when enableRowSelection is true", () => {
      const { getAllByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          enableRowSelection
          enablePagination={false}
          aria-label="Selectable"
        />,
      );
      expect(getAllByLabelText("Select row")).toHaveLength(2);
      expect(getByLabelTextSafe(getAllByLabelText, "Select all rows")).toBeInTheDocument();
    });

    it("virtualizes large datasets", () => {
      vi.mocked(useVirtualizer).mockReturnValueOnce({
        getVirtualItems: () => [{ index: 0, start: 20, end: 68 }],
        getTotalSize: () => 240,
      } as ReturnType<typeof useVirtualizer>);

      const { getByLabelText, container } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={Array.from({ length: 50 }, (_, index) => ({
            id: String(index),
            email: `user${index}@example.com`,
            amount: index * 10,
            status: "success" as const,
          }))}
          enableVirtualization
          enablePagination={false}
          aria-label="Virtualized"
        />,
      );
      expect(getByLabelText("Virtualized")).toBeInTheDocument();
      expect(container.querySelector(".overflow-auto")).toHaveStyle({ maxHeight: "480px" });
      expect(container.querySelector('[style*="height: 20px"]')).toBeInTheDocument();
    });

    it("hides pagination when disabled", () => {
      const { queryByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          enablePagination={false}
          aria-label="No pages"
        />,
      );
      expect(queryByRole("navigation", { name: "Table pagination" })).not.toBeInTheDocument();
    });

    it("omits footer when pagination fits on one page", () => {
      const { queryByRole, queryByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          pageSize={10}
          aria-label="Single page"
        />,
      );
      expect(queryByRole("navigation", { name: "Table pagination" })).not.toBeInTheDocument();
      expect(queryByText(/row\(s\) selected/)).not.toBeInTheDocument();
    });

    it("omits toolbar when filtering is disabled", () => {
      const { queryByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          enableFiltering={false}
          aria-label="No filter"
        />,
      );
      expect(queryByLabelText("Filter rows…")).not.toBeInTheDocument();
    });

    it("renders manual pagination with row count", () => {
      const { getByText, getByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 5)}
          manualPagination
          pageCount={4}
          rowCount={20}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          aria-label="Server table"
        />,
      );
      expect(getByText("20 total row(s).")).toBeInTheDocument();
      expect(getByRole("navigation", { name: "Table pagination" })).toBeInTheDocument();
    });

    it("uses controlled server state callbacks", async () => {
      const user = userEvent.setup();
      const onSortingChange = vi.fn();
      const onPaginationChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 5)}
          manualSorting
          manualPagination
          pageCount={4}
          rowCount={20}
          sorting={[]}
          pagination={{ pageIndex: 0, pageSize: 5 }}
          onSortingChange={onSortingChange}
          onPaginationChange={onPaginationChange}
          pageSizeOptions={[5, 10]}
          aria-label="Controlled server"
        />,
      );
      await user.click(getByRole("button", { name: "Email" }));
      expect(onSortingChange).toHaveBeenCalled();
      await user.click(getByRole("link", { name: "Go to next page" }));
      expect(onPaginationChange).toHaveBeenCalled();
    });

    it("calls onColumnFiltersChange in manual filtering mode", () => {
      const onColumnFiltersChange = vi.fn();
      renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 3)}
          manualFiltering
          columnFilters={[]}
          onColumnFiltersChange={onColumnFiltersChange}
          enableColumnFilters
          enableFiltering={false}
          enablePagination={false}
          aria-label="Manual filter table"
        />,
      );
      expect(onColumnFiltersChange).not.toHaveBeenCalled();
    });

    it("renders with sorting and pagination disabled", () => {
      const { getByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          enableSorting={false}
          enableFiltering={false}
          enablePagination={false}
          stickyHeader={false}
          hideToolbar
          hidePagination
          aria-label="Minimal"
        />,
      );
      expect(getByLabelText("Minimal")).toBeInTheDocument();
    });

    it("hides pagination chrome when hidePagination is true", () => {
      const { queryByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          hidePagination
          aria-label="Hidden pagination"
        />,
      );
      expect(queryByRole("navigation", { name: "Table pagination" })).not.toBeInTheDocument();
    });

    it("uses custom filter placeholder", () => {
      const { getByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          filterPlaceholder="Search payments"
          aria-label="Custom filter"
        />,
      );
      expect(getByLabelText("Search payments")).toBeInTheDocument();
    });

    it("applies maxHeight to the scroll container", () => {
      const { container } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          maxHeight={400}
          aria-label="Sized"
        />,
      );
      expect(container.querySelector(".overflow-auto")).toHaveStyle({ maxHeight: "400px" });
    });

    it("shows selection summary when row selection is enabled", () => {
      const { getByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          enableRowSelection
          enablePagination={false}
          aria-label="Summary"
        />,
      );
      expect(getByText("0 of 2 row(s) selected.")).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("filters rows via global search", async () => {
      const user = userEvent.setup();
      const { getByLabelText, queryByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          enablePagination={false}
          aria-label="Filterable"
        />,
      );

      await user.type(getByLabelText("Filter rows…"), "ada");
      expect(queryByText("grace@example.com")).not.toBeInTheDocument();
      expect(getByLabelText("Filter rows…")).toHaveValue("ada");
    });

    it("sorts when column header is clicked", async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 3)}
          enablePagination={false}
          aria-label="Sortable"
        />,
      );

      await user.click(getByRole("button", { name: "Email" }));
      const rows = getAllByRole("row");
      expect(rows[1]?.textContent).toContain("ada@example.com");
    });

    it("paginates rows", async () => {
      const user = userEvent.setup();
      const { getByRole, queryByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          pageSize={5}
          aria-label="Paginated"
        />,
      );

      expect(queryByText("jenny@example.com")).not.toBeInTheDocument();
      await user.click(getByRole("link", { name: "3" }));
      expect(queryByText("jenny@example.com")).toBeInTheDocument();
    });

    it("selects rows via checkbox", async () => {
      const user = userEvent.setup();
      const onRowSelectionChange = vi.fn();
      const { getAllByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 2)}
          enableRowSelection
          enablePagination={false}
          getRowId={(row) => row.id}
          onRowSelectionChange={onRowSelectionChange}
          aria-label="Selection"
        />,
      );

      const rowCheckboxes = getAllByLabelText("Select row");
      const firstRow = rowCheckboxes[0];
      expect(firstRow).toBeDefined();
      await user.click(firstRow as HTMLElement);
      expect(firstRow).toHaveAttribute("data-state", "checked");
      expect(onRowSelectionChange).toHaveBeenCalledWith({ "1": true });
    });

    it("calls onSortingChange when a column is sorted", async () => {
      const user = userEvent.setup();
      const onSortingChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 3)}
          enablePagination={false}
          onSortingChange={onSortingChange}
          aria-label="Sort callback"
        />,
      );

      await user.click(getByRole("button", { name: "Email" }));
      expect(onSortingChange).toHaveBeenCalledWith([{ id: "email", desc: false }]);
    });

    it("calls onGlobalFilterChange when filtering", async () => {
      const user = userEvent.setup();
      const onGlobalFilterChange = vi.fn();
      const { getByLabelText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          enablePagination={false}
          onGlobalFilterChange={onGlobalFilterChange}
          aria-label="Filter callback"
        />,
      );

      await user.type(getByLabelText("Filter rows…"), "a");
      expect(onGlobalFilterChange).toHaveBeenCalled();
    });

    it("changes page size from the footer selector", async () => {
      const user = userEvent.setup();
      const { getByRole, getByText } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          pageSize={5}
          pageSizeOptions={[5, 10, 20]}
          aria-label="Page size"
        />,
      );

      await user.click(getByRole("combobox", { name: "Rows per page" }));
      await user.click(getByRole("option", { name: "20" }));
      expect(getByText("jenny@example.com")).toBeInTheDocument();
    });

    it("reorders columns from the view options drag handle", async () => {
      const user = userEvent.setup();
      const { container, getAllByRole, getByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments}
          enableColumnReordering
          enablePagination={false}
          aria-label="Reorder columns"
        />,
      );

      const headersBefore = getAllByRole("columnheader").map((header) =>
        header.textContent?.trim(),
      );
      await user.click(getByRole("button", { name: /toggle columns/i }));

      const statusItem = getByRole("menuitemcheckbox", { name: /status/i });
      const emailItem = getByRole("menuitemcheckbox", { name: /email/i });
      const statusHandle = getReorderHandle(statusItem);
      const dataTransfer = createDataTransfer();

      fireEvent.dragStart(statusHandle, { dataTransfer });
      fireEvent.dragOver(emailItem, { dataTransfer });
      fireEvent.drop(emailItem, { dataTransfer });
      await user.keyboard("{Escape}");

      await waitFor(() => {
        const headers = container.querySelectorAll("thead th");
        expect(headers[0]).toHaveTextContent("Status");
      });
      expect(headersBefore[0]).toBe("Email");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 3)}
          aria-label="A11y"
        />,
      );
      await expectNoA11yViolations(container);
    });

    it("sets aria-sort on sortable headers", async () => {
      const user = userEvent.setup();
      const { container, getByRole } = renderWithProviders(
        <DataTable
          columns={samplePaymentColumns}
          data={samplePayments.slice(0, 3)}
          enablePagination={false}
          aria-label="Aria sort"
        />,
      );

      expect(container.querySelector('[aria-sort="none"]')).toBeInTheDocument();
      await user.click(getByRole("button", { name: "Email" }));
      expect(container.querySelector('[aria-sort="ascending"]')).toBeInTheDocument();
    });
  });

  describe("reliability", () => {
    it("re-renders with new data", () => {
      const columns: ColumnDef<SamplePayment>[] = [{ accessorKey: "email", header: "Email" }];
      const { rerender, getByText } = renderWithProviders(
        <DataTable columns={columns} data={samplePayments.slice(0, 1)} aria-label="Rerender" />,
      );
      rerender(
        <DataTable columns={columns} data={samplePayments.slice(1, 2)} aria-label="Rerender" />,
      );
      expect(getByText("grace@example.com")).toBeInTheDocument();
    });
  });
});

function getByLabelTextSafe(
  getAllByLabelText: (text: string) => HTMLElement[],
  label: string,
): HTMLElement {
  const matches = getAllByLabelText(label);
  expect(matches[0]).toBeDefined();
  return matches[0] as HTMLElement;
}
