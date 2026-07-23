import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders, userEvent } from "../../../tests/utils";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "./carousel";

const mockScrollTo = vi.fn();
const mockScrollSnapList = vi.fn(() => [0, 400]);

vi.mock("embla-carousel-react", () => ({
  default: () => [
    vi.fn(),
    {
      canScrollPrev: () => false,
      canScrollNext: () => true,
      selectedScrollSnap: () => 0,
      scrollSnapList: mockScrollSnapList,
      scrollTo: mockScrollTo,
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    },
  ],
}));

describe("CarouselDots", () => {
  it("renders a button per scroll snap and navigates on click", async () => {
    mockScrollSnapList.mockReturnValue([0, 400]);
    const user = userEvent.setup();

    const { getAllByRole } = renderWithProviders(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>,
    );

    await waitFor(() => {
      expect(getAllByRole("button", { name: /go to slide/i })).toHaveLength(2);
    });

    const dots = getAllByRole("button", { name: /go to slide 2/i });
    expect(dots[0]).toBeDefined();
    await user.click(dots[0] as HTMLButtonElement);
    expect(mockScrollTo).toHaveBeenCalledWith(1);
  });

  it("hides dots when only one scroll snap exists", async () => {
    mockScrollSnapList.mockReturnValue([0]);

    const { queryAllByRole } = renderWithProviders(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>,
    );

    await waitFor(() => {
      expect(queryAllByRole("button", { name: /go to slide/i })).toHaveLength(0);
    });
  });
});
