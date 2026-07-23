import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPageSelect,
  PaginationPrevious,
  PaginationRowsPerPage,
  PaginationSelectors,
  PaginationToolbar,
  PaginationToolbarCenter,
  PaginationToolbarEnd,
  PaginationToolbarStart,
} from "./pagination";

function BasicPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/page/1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/page/1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/page/2" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/page/3">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/page/3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

describe("Pagination", () => {
  describe("rendering", () => {
    it("renders pagination navigation with page links", () => {
      const { getByRole } = renderWithProviders(<BasicPagination />);
      expect(getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
      expect(getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
      expect(getByRole("link", { name: "Go to previous page" })).toHaveAttribute("href", "/page/1");
    });

    it("merges custom className on parts", () => {
      const { getByRole } = renderWithProviders(
        <Pagination className="custom-nav">
          <PaginationContent className="custom-content">
            <PaginationItem className="custom-item">
              <PaginationLink href="#" className="custom-link">
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      expect(getByRole("navigation")).toHaveClass("custom-nav");
      expect(getByRole("link", { name: "1" })).toHaveClass("custom-link");
    });

    it("renders ellipsis with screen reader text", () => {
      const { getByText } = renderWithProviders(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      expect(getByText("More pages")).toHaveClass("sr-only");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on pagination parts", () => {
      const navRef = createRef<HTMLElement>();
      const contentRef = createRef<HTMLUListElement>();
      const itemRef = createRef<HTMLLIElement>();
      const linkRef = createRef<HTMLAnchorElement>();
      const prevRef = createRef<HTMLAnchorElement>();
      const nextRef = createRef<HTMLAnchorElement>();
      const ellipsisRef = createRef<HTMLSpanElement>();

      renderWithProviders(
        <Pagination ref={navRef}>
          <PaginationContent ref={contentRef}>
            <PaginationItem ref={itemRef}>
              <PaginationPrevious ref={prevRef} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink ref={linkRef} href="#">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext ref={nextRef} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis ref={ellipsisRef} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );

      expect(navRef.current).toBeInstanceOf(HTMLElement);
      expect(contentRef.current).toBeInstanceOf(HTMLUListElement);
      expect(itemRef.current).toBeInstanceOf(HTMLLIElement);
      expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
      expect(prevRef.current).toBeInstanceOf(HTMLAnchorElement);
      expect(nextRef.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ellipsisRef.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("supports custom navigation label", () => {
      const { getByRole } = renderWithProviders(
        <Pagination label="Results pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      expect(getByRole("navigation", { name: "Results pages" })).toBeInTheDocument();
    });

    it("applies outline variant to active page link", () => {
      const { getByRole } = renderWithProviders(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      expect(getByRole("link", { name: "2" })).toHaveClass("border");
    });

    it("renders rows-per-page and page selectors", () => {
      const { getByRole, getByText } = renderWithProviders(
        <PaginationToolbar>
          <PaginationSelectors>
            <PaginationRowsPerPage value={10} options={[10, 20]} />
            <PaginationPageSelect page={2} pageCount={5} />
          </PaginationSelectors>
        </PaginationToolbar>,
      );
      expect(getByText("Rows per page")).toBeInTheDocument();
      expect(getByText("Page")).toBeInTheDocument();
      expect(getByRole("combobox", { name: "Rows per page" })).toHaveTextContent("10");
      expect(getByRole("combobox", { name: "Select page" })).toHaveTextContent("2");
    });

    it("aligns toolbar zones start, center, and end", () => {
      const { container } = renderWithProviders(
        <PaginationToolbar>
          <PaginationToolbarStart>Left</PaginationToolbarStart>
          <PaginationToolbarCenter>Center</PaginationToolbarCenter>
          <PaginationToolbarEnd>Right</PaginationToolbarEnd>
        </PaginationToolbar>,
      );
      expect(container.querySelector("[class*='justify-start']")).toHaveTextContent("Left");
      expect(container.querySelector("[class*='justify-center']")).toHaveTextContent("Center");
      expect(container.querySelector("[class*='justify-end']")).toHaveTextContent("Right");
    });
  });

  describe("interactions", () => {
    it("renders navigable previous and next links", () => {
      const { getByRole } = renderWithProviders(<BasicPagination />);
      expect(getByRole("link", { name: "Go to next page" })).toHaveAttribute("href", "/page/3");
    });

    it("calls onValueChange when rows per page changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <PaginationRowsPerPage value={10} options={[10, 20, 30]} onValueChange={onValueChange} />,
      );

      await user.click(getByRole("combobox", { name: "Rows per page" }));
      await user.click(getByRole("option", { name: "20" }));

      expect(onValueChange).toHaveBeenCalledWith(20);
    });

    it("calls onPageChange when page changes", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      const { getByRole } = renderWithProviders(
        <PaginationPageSelect page={1} pageCount={3} onPageChange={onPageChange} />,
      );

      await user.click(getByRole("combobox", { name: "Select page" }));
      await user.click(getByRole("option", { name: "3" }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<BasicPagination />);
      await expectNoA11yViolations(container);
    });

    it("has no axe violations with selectors", async () => {
      const { container } = renderWithProviders(
        <PaginationToolbar>
          <PaginationSelectors>
            <PaginationRowsPerPage value={10} />
            <PaginationPageSelect page={2} pageCount={5} />
          </PaginationSelectors>
          <BasicPagination />
        </PaginationToolbar>,
      );
      await expectNoA11yViolations(container);
    });

    it("marks active page with aria-current", () => {
      const { getByRole } = renderWithProviders(<BasicPagination />);
      expect(getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    });
  });

  describe("reliability", () => {
    it("re-renders pagination without throwing", () => {
      const { rerender, getByRole } = renderWithProviders(<BasicPagination />);
      rerender(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>,
      );
      expect(getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page");
    });
  });
});
