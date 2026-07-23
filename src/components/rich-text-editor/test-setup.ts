/**
 * TipTap / ProseMirror layout polyfills for jsdom — import only in editor tests.
 */
const layoutRect = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;

if (!document.elementFromPoint) {
  document.elementFromPoint = () => null;
}

if (!Element.prototype.getClientRects) {
  Element.prototype.getClientRects = function getClientRects() {
    return {
      length: 1,
      0: layoutRect,
      item: (index: number) => (index === 0 ? layoutRect : null),
      [Symbol.iterator]: function* iterator() {
        yield layoutRect;
      },
    } as unknown as DOMRectList;
  };
}
