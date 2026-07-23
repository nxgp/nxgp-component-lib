import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations, renderWithProviders } from "../../../tests/utils";
import { Button } from "../button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";

function BasicBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  describe("rendering", () => {
    it("renders breadcrumb trail with current page", () => {
      const { getByRole, getByText } = renderWithProviders(<BasicBreadcrumb />);
      expect(getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
      expect(getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
      expect(getByText("Components")).toHaveAttribute("aria-current", "page");
    });

    it("merges custom className on parts", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Breadcrumb className="custom-nav">
          <BreadcrumbList className="custom-list">
            <BreadcrumbItem className="custom-item">
              <BreadcrumbLink href="/" className="custom-link">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="custom-separator" />
            <BreadcrumbItem>
              <BreadcrumbPage className="custom-page">Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByRole("navigation")).toHaveClass("custom-nav");
      expect(getByRole("link", { name: "Home" })).toHaveClass("custom-link");
      expect(getByText("Current")).toHaveClass("custom-page");
    });

    it("renders ellipsis indicator", () => {
      const { getByText } = renderWithProviders(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByText("More")).toHaveClass("sr-only");
    });
  });

  describe("props and edge cases", () => {
    it("forwards refs on breadcrumb parts", () => {
      const navRef = createRef<HTMLElement>();
      const listRef = createRef<HTMLOListElement>();
      const itemRef = createRef<HTMLLIElement>();
      const linkRef = createRef<HTMLAnchorElement>();
      const pageRef = createRef<HTMLSpanElement>();
      const separatorRef = createRef<HTMLLIElement>();
      const ellipsisRef = createRef<HTMLSpanElement>();

      renderWithProviders(
        <Breadcrumb ref={navRef}>
          <BreadcrumbList ref={listRef}>
            <BreadcrumbItem ref={itemRef}>
              <BreadcrumbLink ref={linkRef} href="/">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator ref={separatorRef} />
            <BreadcrumbItem>
              <BreadcrumbPage ref={pageRef}>Current</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbEllipsis ref={ellipsisRef} />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );

      expect(navRef.current).toBeInstanceOf(HTMLElement);
      expect(listRef.current).toBeInstanceOf(HTMLOListElement);
      expect(itemRef.current).toBeInstanceOf(HTMLLIElement);
      expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
      expect(pageRef.current).toBeInstanceOf(HTMLSpanElement);
      expect(separatorRef.current).toBeInstanceOf(HTMLLIElement);
      expect(ellipsisRef.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("supports custom nav label", () => {
      const { getByRole } = renderWithProviders(
        <Breadcrumb label="Site hierarchy">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByRole("navigation", { name: "Site hierarchy" })).toBeInTheDocument();
    });

    it("renders asChild link with custom element", () => {
      const { getByRole } = renderWithProviders(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button variant="link">Home</Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByRole("button", { name: "Home" })).toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("renders clickable ancestor links", () => {
      const { getByRole } = renderWithProviders(<BasicBreadcrumb />);
      expect(getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(<BasicBreadcrumb />);
      await expectNoA11yViolations(container);
    });

    it("marks current page as aria-current", () => {
      const { getByText } = renderWithProviders(<BasicBreadcrumb />);
      expect(getByText("Components")).toHaveAttribute("aria-current", "page");
    });
  });

  describe("reliability", () => {
    it("re-renders trail without throwing", () => {
      const { rerender, getByText } = renderWithProviders(<BasicBreadcrumb />);
      rerender(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>,
      );
      expect(getByText("Settings")).toBeInTheDocument();
    });
  });
});
