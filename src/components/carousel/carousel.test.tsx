import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations, renderWithProviders, userEvent } from "../../../tests/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

describe("Carousel", () => {
  describe("rendering", () => {
    it("renders slides", () => {
      const { getByRole, getByText } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide A</CarouselItem>
            <CarouselItem>Slide B</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(getByRole("region", { name: "" })).toHaveAttribute("aria-roledescription", "carousel");
      expect(getByText("Slide A")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { getByRole } = renderWithProviders(
        <Carousel className="custom-carousel">
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(getByRole("region", { name: "" })).toHaveClass("custom-carousel");
    });
  });

  describe("props and state edge cases", () => {
    it("forwards ref on Carousel", () => {
      const ref = createRef<HTMLDivElement>();
      renderWithProviders(
        <Carousel ref={ref}>
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("calls setApi when carousel initializes", () => {
      const setApi = vi.fn();
      renderWithProviders(
        <Carousel setApi={setApi}>
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(setApi).toHaveBeenCalled();
    });
  });

  describe("interactions", () => {
    it("renders navigation buttons", () => {
      const { getByRole } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      expect(getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Next slide" })).toBeInTheDocument();
    });

    it("handles keyboard navigation without throwing", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      const region = getByRole("region", { name: "" });
      region.focus();
      await user.keyboard("{ArrowRight}");
      expect(region).toBeInTheDocument();
    });

    it("invokes scroll handlers when buttons are clicked", async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      await user.click(getByRole("button", { name: "Next slide" }));
      await user.click(getByRole("button", { name: "Previous slide" }));
      expect(getByRole("region", { name: "" })).toBeInTheDocument();
    });

    it("supports vertical orientation", () => {
      const { getByRole } = renderWithProviders(
        <Carousel orientation="vertical">
          <CarouselContent>
            <CarouselItem>Slide</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>,
      );
      expect(getByRole("region", { name: "" })).toBeInTheDocument();
    });

    it("supports autoplay prop", () => {
      const { getByRole } = renderWithProviders(
        <Carousel autoplay>
          <CarouselContent>
            <CarouselItem>Slide 1</CarouselItem>
            <CarouselItem>Slide 2</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(getByRole("region", { name: "" })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no axe violations", async () => {
      const { container } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Accessible slide</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      await expectNoA11yViolations(container);
    });
  });

  describe("reliability", () => {
    it("re-renders slides", () => {
      const { getByText, rerender } = renderWithProviders(
        <Carousel>
          <CarouselContent>
            <CarouselItem>First</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      rerender(
        <Carousel>
          <CarouselContent>
            <CarouselItem>Second</CarouselItem>
          </CarouselContent>
        </Carousel>,
      );
      expect(getByText("Second")).toBeInTheDocument();
    });
  });
});
