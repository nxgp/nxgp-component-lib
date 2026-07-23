import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";

/**
 * jsdom does not implement matchMedia — required by ThemeProvider.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

/**
 * Radix Slider/Select use ResizeObserver.
 */
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock;

/**
 * Embla Carousel uses IntersectionObserver for slides in view.
 */
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver;

/**
 * Radix Select scrolls focused items into view; jsdom does not implement scrollIntoView.
 */
Element.prototype.scrollIntoView = () => {};

/**
 * Radix Toast swipe handlers use pointer capture APIs missing in jsdom.
 */
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
