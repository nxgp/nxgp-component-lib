import type { Table } from "@tanstack/react-table";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/utils";
import { DataTablePagination } from "./data-table-pagination";
import {
  DataTableSelectAllCheckbox,
  DataTableSelectRowCheckbox,
  DataTableToolbar,
  DataTableViewOptions,
} from "./data-table-toolbar";

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

function createTableMock(overrides: Partial<Table<unknown>> = {}): Table<unknown> {
  return {
    getPageCount: () => 3,
    getState: () => ({ pagination: { pageIndex: 1 } }),
    getCanPreviousPage: () => true,
    getCanNextPage: () => true,
    previousPage: vi.fn(),
    nextPage: vi.fn(),
    setPageIndex: vi.fn(),
    ...overrides,
  } as unknown as Table<unknown>;
}

describe("DataTablePagination", () => {
  it("returns null when only one page exists", () => {
    const table = createTableMock({ getPageCount: () => 1 });
    const { container } = renderWithProviders(<DataTablePagination table={table} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("navigates pages via controls", async () => {
    const user = userEvent.setup();
    const table = createTableMock();

    const { getByRole } = renderWithProviders(<DataTablePagination table={table} />);

    await user.click(getByRole("link", { name: "Go to previous page" }));
    await user.click(getByRole("link", { name: "Go to next page" }));
    await user.click(getByRole("link", { name: "2" }));

    expect(table.previousPage).toHaveBeenCalled();
    expect(table.nextPage).toHaveBeenCalled();
    expect(table.setPageIndex).toHaveBeenCalledWith(1);
  });

  it("renders ellipsis for large page counts", () => {
    const table = createTableMock({
      getPageCount: () => 12,
      getState: (() => ({ pagination: { pageIndex: 5 } })) as Table<unknown>["getState"],
    });

    const { getByText, queryByRole } = renderWithProviders(<DataTablePagination table={table} />);
    expect(getByText("1")).toBeInTheDocument();
    expect(getByText("12")).toBeInTheDocument();
    expect(queryByRole("link", { name: "6" })).toBeInTheDocument();
    expect(queryByRole("link", { name: "8" })).not.toBeInTheDocument();
  });
});

describe("DataTableToolbar", () => {
  it("updates global filter value", async () => {
    const user = userEvent.setup();
    const setGlobalFilter = vi.fn();
    const table = {
      getState: () => ({ globalFilter: "", columnOrder: [] }),
      setGlobalFilter,
      getAllColumns: () => [],
      getAllLeafColumns: () => [],
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(<DataTableToolbar table={table} />);
    await user.type(getByLabelText("Filter rows…"), "ada");
    expect(setGlobalFilter).toHaveBeenCalled();
  });

  it("handles undefined global filter state", () => {
    const table = {
      getState: () => ({ columnOrder: [] }),
      setGlobalFilter: vi.fn(),
      getAllColumns: () => [],
      getAllLeafColumns: () => [],
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(<DataTableToolbar table={table} />);
    expect(getByLabelText("Filter rows…")).toHaveValue("");
  });

  it("hides column visibility menu when disabled", () => {
    const table = {
      getState: () => ({ globalFilter: "", columnOrder: [] }),
      setGlobalFilter: vi.fn(),
      getAllColumns: () => [],
      getAllLeafColumns: () => [],
    } as unknown as Table<unknown>;

    const { queryByRole } = renderWithProviders(
      <DataTableToolbar table={table} showColumnVisibility={false} />,
    );
    expect(queryByRole("button", { name: /toggle columns/i })).not.toBeInTheDocument();
  });

  it("hides global filter when disabled", () => {
    const table = {
      getState: () => ({ globalFilter: "", columnOrder: [] }),
      setGlobalFilter: vi.fn(),
      getAllColumns: () => [],
      getAllLeafColumns: () => [],
    } as unknown as Table<unknown>;

    const { queryByLabelText } = renderWithProviders(
      <DataTableToolbar table={table} showGlobalFilter={false} />,
    );
    expect(queryByLabelText("Filter rows…")).not.toBeInTheDocument();
  });

  it("renders per-column filters", async () => {
    const user = userEvent.setup();
    const setFilterValue = vi.fn();
    const table = {
      getState: () => ({ globalFilter: "", columnOrder: [] }),
      setGlobalFilter: vi.fn(),
      getAllLeafColumns: () => [{ id: "email" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanFilter: () => true,
          getCanHide: () => false,
          getFilterValue: () => "",
          setFilterValue,
          columnDef: { meta: { filterPlaceholder: "Filter email…" } },
        },
      ],
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(
      <DataTableToolbar table={table} enableColumnFilters />,
    );
    await user.type(getByLabelText("Filter email…"), "ada");
    expect(setFilterValue).toHaveBeenCalled();
  });
});

describe("DataTableViewOptions", () => {
  it("toggles column visibility", async () => {
    const user = userEvent.setup();
    const toggleVisibility = vi.fn();
    const table = {
      getState: () => ({ columnOrder: [] }),
      getAllLeafColumns: () => [{ id: "email" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility,
        },
      ],
    } as unknown as Table<unknown>;

    const { getByRole } = renderWithProviders(<DataTableViewOptions table={table} />);
    await user.click(getByRole("button", { name: /toggle columns/i }));
    await user.click(getByRole("menuitemcheckbox", { name: /email/i }));
    expect(toggleVisibility).toHaveBeenCalledWith(false);
  });

  it("reorders columns on drag and drop", async () => {
    const setColumnOrder = vi.fn();
    const table = {
      getState: () => ({ columnOrder: ["email", "status", "amount"] }),
      setColumnOrder,
      getAllLeafColumns: () => [{ id: "email" }, { id: "status" }, { id: "amount" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
        {
          id: "status",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
      ],
    } as unknown as Table<unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableViewOptions table={table} enableColumnReordering />,
    );
    await userEvent.click(getByRole("button", { name: /toggle columns/i }));

    const emailItem = getByRole("menuitemcheckbox", { name: /email/i });
    const statusItem = getByRole("menuitemcheckbox", { name: /status/i });
    const statusHandle = getReorderHandle(statusItem);

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(statusHandle, { dataTransfer });
    fireEvent.dragOver(emailItem, { dataTransfer });
    fireEvent.drop(emailItem, { dataTransfer });

    expect(setColumnOrder).toHaveBeenCalledWith(["status", "email", "amount"]);
  });

  it("highlights the dragged column while reordering", async () => {
    const table = {
      getState: () => ({ columnOrder: ["email", "status", "amount"] }),
      setColumnOrder: vi.fn(),
      getAllLeafColumns: () => [{ id: "email" }, { id: "status" }, { id: "amount" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
        {
          id: "status",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
      ],
    } as unknown as Table<unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableViewOptions table={table} enableColumnReordering />,
    );
    await userEvent.click(getByRole("button", { name: /toggle columns/i }));

    const statusItem = getByRole("menuitemcheckbox", { name: /status/i });
    const statusHandle = getReorderHandle(statusItem);
    const dataTransfer = createDataTransfer();

    fireEvent.dragStart(statusHandle, { dataTransfer });

    expect(statusItem).toHaveAttribute("data-dragging");
    expect(statusHandle).toHaveAttribute("aria-grabbed", "true");
  });

  it("ignores drop when dragging the same column", async () => {
    const setColumnOrder = vi.fn();
    const table = {
      getState: () => ({ columnOrder: ["email", "status"] }),
      setColumnOrder,
      getAllLeafColumns: () => [{ id: "email" }, { id: "status" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
      ],
    } as unknown as Table<unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableViewOptions table={table} enableColumnReordering />,
    );
    await userEvent.click(getByRole("button", { name: /toggle columns/i }));

    const emailItem = getByRole("menuitemcheckbox", { name: /email/i });
    const emailHandle = getReorderHandle(emailItem);
    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(emailHandle, { dataTransfer });
    fireEvent.drop(emailItem, { dataTransfer });

    expect(setColumnOrder).not.toHaveBeenCalled();
  });

  it("appends column when target is missing from order", async () => {
    const setColumnOrder = vi.fn();
    const table = {
      getState: () => ({ columnOrder: [] }),
      setColumnOrder,
      getAllLeafColumns: () => [{ id: "email" }, { id: "status" }],
      getAllColumns: () => [
        {
          id: "email",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
        {
          id: "status",
          getCanHide: () => true,
          getIsVisible: () => true,
          toggleVisibility: vi.fn(),
        },
      ],
    } as unknown as Table<unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableViewOptions table={table} enableColumnReordering />,
    );
    await userEvent.click(getByRole("button", { name: /toggle columns/i }));

    const emailItem = getByRole("menuitemcheckbox", { name: /email/i });
    const statusItem = getByRole("menuitemcheckbox", { name: /status/i });
    const emailHandle = getReorderHandle(emailItem);
    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(emailHandle, { dataTransfer });
    fireEvent.drop(statusItem, { dataTransfer });

    expect(setColumnOrder).toHaveBeenCalled();
  });
});

describe("DataTableSelectAllCheckbox", () => {
  it("toggles all page rows", async () => {
    const user = userEvent.setup();
    const toggleAllPageRowsSelected = vi.fn();
    const table = {
      getIsAllPageRowsSelected: () => false,
      getIsSomePageRowsSelected: () => false,
      toggleAllPageRowsSelected,
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(<DataTableSelectAllCheckbox table={table} />);
    await user.click(getByLabelText("Select all rows"));
    expect(toggleAllPageRowsSelected).toHaveBeenCalledWith(true);
  });

  it("renders indeterminate state", () => {
    const table = {
      getIsAllPageRowsSelected: () => false,
      getIsSomePageRowsSelected: () => true,
      toggleAllPageRowsSelected: vi.fn(),
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(<DataTableSelectAllCheckbox table={table} />);
    expect(getByLabelText("Select all rows")).toHaveAttribute("data-state", "indeterminate");
  });
});

describe("DataTableSelectRowCheckbox", () => {
  it("handles missing rows", () => {
    const table = {
      getRow: () => undefined,
    } as unknown as Table<unknown>;

    const { getByLabelText } = renderWithProviders(
      <DataTableSelectRowCheckbox table={table} rowId="missing" />,
    );
    expect(getByLabelText("Select row")).toHaveAttribute("data-state", "unchecked");
  });
});
