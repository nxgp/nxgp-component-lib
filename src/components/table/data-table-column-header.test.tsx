import type { Column } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../../tests/utils";
import { DataTableColumnHeader } from "./data-table-column-header";

describe("DataTableColumnHeader", () => {
  it("renders plain text when sorting is disabled", () => {
    const column = {
      getCanSort: () => false,
    } as Column<unknown, unknown>;

    const { getByText, queryByRole } = renderWithProviders(
      <DataTableColumnHeader column={column} title="Status" />,
    );

    expect(getByText("Status")).toBeInTheDocument();
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("toggles sort direction when clicked", async () => {
    const user = userEvent.setup();
    const toggleSorting = vi.fn();
    const column = {
      getCanSort: () => true,
      getIsSorted: () => "asc" as const,
      toggleSorting,
    } as unknown as Column<unknown, unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableColumnHeader column={column} title="Email" />,
    );

    await user.click(getByRole("button", { name: "Email" }));
    expect(toggleSorting).toHaveBeenCalledWith(true);
  });

  it("renders descending sort icon", () => {
    const column = {
      getCanSort: () => true,
      getIsSorted: () => "desc" as const,
      toggleSorting: vi.fn(),
    } as unknown as Column<unknown, unknown>;

    const { container } = renderWithProviders(
      <DataTableColumnHeader column={column} title="Amount" />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders unsorted icon", () => {
    const column = {
      getCanSort: () => true,
      getIsSorted: () => false,
      toggleSorting: vi.fn(),
    } as unknown as Column<unknown, unknown>;

    const { getByRole } = renderWithProviders(
      <DataTableColumnHeader column={column} title="Name" />,
    );

    expect(getByRole("button", { name: "Name" })).toBeInTheDocument();
  });
});
