import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  const sampleTable = (
    <Table aria-label="Demo table">
      <TableCaption>Monthly invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Paid</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  describe("rendering", () => {
    it("renders table structure", () => {
      const { getByRole, getByText } = renderWithProviders(sampleTable);
      expect(getByRole("table", { name: "Demo table" })).toBeInTheDocument();
      expect(getByText("Monthly invoices")).toBeInTheDocument();
      expect(getByText("Ada")).toBeInTheDocument();
    });

    it("applies compact density by default", () => {
      const { getByRole } = renderWithProviders(
        <Table aria-label="Compact">
          <TableBody>
            <TableRow>
              <TableCell>Row</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByRole("table")).toHaveClass("[&_td]:py-cell-y-compact");
    });

    it("applies comfortable density classes", () => {
      const { getByRole } = renderWithProviders(
        <Table density="comfortable" aria-label="Comfortable">
          <TableBody>
            <TableRow>
              <TableCell>Row</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByRole("table")).toHaveClass("[&_td]:py-cell-y-comfortable");
    });

    it("renders without scroll container when noContainer is set", () => {
      const { getByRole, container } = renderWithProviders(
        <Table noContainer aria-label="Bare">
          <TableBody>
            <TableRow>
              <TableCell>Row</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByRole("table")).toBe(container.querySelector("table"));
    });

    it("renders footer section", () => {
      const { getByText } = renderWithProviders(
        <Table aria-label="Footer table">
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );
      expect(getByText("Total")).toBeInTheDocument();
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref to the table element", () => {
      const ref = createRef<HTMLTableElement>();
      renderWithProviders(
        <Table ref={ref} noContainer aria-label="Ref">
          <TableBody>
            <TableRow>
              <TableCell>Row</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(ref.current?.tagName.toLowerCase()).toBe("table");
    });

    it("marks selected rows via data-state", () => {
      const { getByText } = renderWithProviders(
        <Table aria-label="Selected">
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Selected row</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByText("Selected row").closest("tr")).toHaveAttribute("data-state", "selected");
    });

    it("pairs accent background with accent foreground on interactive rows", () => {
      const { getByText } = renderWithProviders(
        <Table aria-label="Interactive">
          <TableBody>
            <TableRow>
              <TableCell>Hover row</TableCell>
              <TableCell className="text-muted-foreground">Muted cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const row = getByText("Hover row").closest("tr");
      expect(row).toHaveClass("hover:bg-accent");
      expect(row).toHaveClass("hover:text-accent-foreground");
      expect(row).toHaveClass("hover:[&_td]:text-accent-foreground");
      expect(row).toHaveClass("data-[state=selected]:[&_td]:text-accent-foreground");
    });

    it("applies striped row styling", () => {
      const { getByRole } = renderWithProviders(
        <Table striped aria-label="Striped">
          <TableBody>
            <TableRow>
              <TableCell>One</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByRole("table")).toHaveClass("[&_tbody_tr:nth-child(even)]:bg-muted/40");
    });

    it("applies sticky column classes", () => {
      const { getByRole } = renderWithProviders(
        <Table aria-label="Sticky">
          <TableHeader>
            <TableRow>
              <TableHead sticky="left">Name</TableHead>
              <TableHead sticky="right" className="text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell sticky="left">Ada</TableCell>
              <TableCell sticky="right" className="text-right">
                $10
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByRole("columnheader", { name: "Name" })).toHaveAttribute("data-sticky", "left");
      expect(getByRole("columnheader", { name: "Amount" })).toHaveAttribute("data-sticky", "right");
      expect(getByRole("cell", { name: "Ada" })).toHaveClass("sticky");
      expect(getByRole("cell", { name: "$10" })).toHaveAttribute("data-sticky", "right");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(sampleTable);
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders rows without throwing", () => {
      const { rerender, getByText } = renderWithProviders(
        <Table aria-label="Rerender">
          <TableBody>
            <TableRow>
              <TableCell>First</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      rerender(
        <Table aria-label="Rerender">
          <TableBody>
            <TableRow>
              <TableCell>Second</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});
