import Autoplay, { type AutoplayOptionsType } from "embla-carousel-autoplay";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import {
  type ComponentProps,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { a11yLabels } from "../../lib/a11y-labels";
import { cn } from "../../lib/cn";
import { ArrowLeftIcon, ArrowRightIcon } from "../../lib/icons";
import { Button } from "../button/button";
import {
  type CarouselContentVariantProps,
  type CarouselItemVariantProps,
  carouselContentVariants,
  carouselItemVariants,
} from "./carousel.variants";

type CarouselApi = UseEmblaCarouselType[1];
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0];
type CarouselPlugin = Parameters<typeof useEmblaCarousel>[1];

type CarouselContextValue = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
  selectedIndex: number;
  scrollSnaps: number[];
  scrollTo: (index: number) => void;
};

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within <Carousel />");
  }
  return context;
}

export type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  /** Enable autoplay — boolean or {@link AutoplayOptionsType}. */
  autoplay?: boolean | AutoplayOptionsType;
};

/**
 * Embla-powered carousel with keyboard navigation and previous/next controls.
 *
 * @example
 * ```tsx
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 * ```
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    { orientation = "horizontal", opts, plugins, autoplay, setApi, className, children, ...props },
    ref,
  ) => {
    const autoplayPlugin = useMemo(
      () => (autoplay ? Autoplay(autoplay === true ? { delay: 4000 } : autoplay) : null),
      [autoplay],
    );
    const resolvedPlugins = useMemo(
      () => [...(plugins ?? []), ...(autoplayPlugin ? [autoplayPlugin] : [])],
      [plugins, autoplayPlugin],
    );
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      resolvedPlugins.length > 0 ? resolvedPlugins : undefined,
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback((emblaApi: NonNullable<CarouselApi>) => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);
    const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollNext, scrollPrev],
    );

    useEffect(() => {
      if (!api) {
        return;
      }

      setApi?.(api);
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect, setApi]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          orientation,
          selectedIndex,
          scrollSnaps,
          scrollTo,
        }}
      >
        {/* biome-ignore lint/a11y/useSemanticElements: carousel region requires aria-roledescription */}
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          onKeyDownCapture={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

export type CarouselContentProps = HTMLAttributes<HTMLDivElement> & CarouselContentVariantProps;

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, orientation: orientationProp, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    const resolvedOrientation = orientationProp ?? orientation;

    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(carouselContentVariants({ orientation: resolvedOrientation, className }))}
          {...props}
        />
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

export type CarouselItemProps = HTMLAttributes<HTMLDivElement> & CarouselItemVariantProps;

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, orientation: orientationProp, ...props }, ref) => {
    const { orientation } = useCarousel();
    const resolvedOrientation = orientationProp ?? orientation;

    return (
      // biome-ignore lint/a11y/useSemanticElements: slide groups use roledescription per WAI-ARIA carousel pattern
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(carouselItemVariants({ orientation: resolvedOrientation, className }))}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = "CarouselItem";

export type CarouselButtonProps = ComponentProps<typeof Button>;

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn(
          "absolute size-8 rounded-full",
          orientation === "horizontal"
            ? "top-1/2 -left-12 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        aria-label={a11yLabels.previousSlide}
        {...props}
      >
        <ArrowLeftIcon />
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        size={size}
        className={cn(
          "absolute size-8 rounded-full",
          orientation === "horizontal"
            ? "top-1/2 -right-12 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        aria-label={a11yLabels.nextSlide}
        {...props}
      >
        <ArrowRightIcon />
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export type CarouselDotsProps = HTMLAttributes<HTMLDivElement>;

/** Dot indicators for the active carousel slide. */
export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, ...props }, ref) => {
    const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

    if (scrollSnaps.length <= 1) {
      return null;
    }

    return (
      <div
        ref={ref}
        data-slot="carousel-dots"
        className={cn("flex items-center justify-center gap-2", className)}
        {...props}
      >
        {scrollSnaps.map((snap, slideIndex) => (
          <button
            key={`carousel-dot-${snap}`}
            type="button"
            aria-label={a11yLabels.goToSlide(slideIndex + 1)}
            aria-current={selectedIndex === slideIndex ? "true" : undefined}
            className={cn(
              "size-2 rounded-full transition-colors",
              selectedIndex === slideIndex ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50",
            )}
            onClick={() => scrollTo(slideIndex)}
          />
        ))}
      </div>
    );
  },
);
CarouselDots.displayName = "CarouselDots";

export type { CarouselApi };
