import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import {
  booleanArg,
  choiceArg,
  defineComponentStories,
  hiddenArg,
} from "../../../.storybook/utils/arg-types";
import { playgroundStory, storyDoc } from "../../../.storybook/utils/playground";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";

function CarouselSlide({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-md border border-border p-6">
      {children}
    </div>
  );
}

type CarouselStoryArgs = ComponentProps<typeof Carousel> & {
  loop?: boolean;
};

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  subcomponents: {
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
  },
  ...defineComponentStories(
    "Embla-powered carousel with keyboard navigation, autoplay, and previous/next controls.",
    {
      orientation: choiceArg(["horizontal", "vertical"] as const, {
        description: "Layout axis for the carousel.",
        defaultValue: "horizontal",
      }),
      autoplay: booleanArg({
        description: "Enable autoplay — pass `true` or Autoplay plugin options.",
        defaultValue: false,
      }),
      loop: booleanArg({
        description: "Loop back to the first slide after the last.",
        defaultValue: false,
      }),
      opts: hiddenArg("Embla carousel options forwarded to useEmblaCarousel."),
      plugins: hiddenArg("Additional Embla plugins."),
      setApi: hiddenArg("Callback receiving the Embla API instance."),
    },
  ),
} satisfies Meta<CarouselStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = ["One", "Two", "Three", "Four"];

export const Default: Story = playgroundStory({
  args: { orientation: "horizontal", autoplay: false, loop: false },
  render: ({ loop, ...args }: CarouselStoryArgs) => (
    <div className="mx-auto max-w-sm px-12">
      <Carousel {...args} opts={{ loop }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <CarouselSlide>
                <span className="text-4xl font-semibold">{slide}</span>
              </CarouselSlide>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
});

export const AutoplayWithDots: Story = {
  ...storyDoc("Autoplay carousel with dot indicators for slide position."),
  render: () => (
    <div className="mx-auto max-w-sm px-12">
      <Carousel autoplay={{ delay: 3000 }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide}>
              <CarouselSlide>
                <span className="text-4xl font-semibold">{slide}</span>
              </CarouselSlide>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots className="mt-4" />
      </Carousel>
    </div>
  ),
};

export const AllSizes: Story = {
  ...storyDoc("Side-by-side comparison of every size preset."),
  render: () => (
    <div className="mx-auto max-w-xs px-12">
      <Carousel>
        <CarouselContent>
          {slides.slice(0, 2).map((slide) => (
            <CarouselItem key={slide}>
              <div className="flex h-32 items-center justify-center rounded-md border border-border">
                {slide}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};
