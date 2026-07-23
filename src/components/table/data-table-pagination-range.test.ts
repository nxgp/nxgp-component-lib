import { describe, expect, it } from "vitest";
import { getPaginationRange } from "./data-table-pagination-range";

describe("getPaginationRange", () => {
  it("returns all pages when page count is seven or fewer", () => {
    expect(getPaginationRange(5, 2)).toEqual([0, 1, 2, 3, 4]);
  });

  it("windows large page counts with ellipsis", () => {
    expect(getPaginationRange(10, 5)).toEqual([0, "ellipsis", 4, 5, 6, "ellipsis", 9]);
  });

  it("shows leading pages without ellipsis when near the start", () => {
    expect(getPaginationRange(10, 0)).toEqual([0, 1, "ellipsis", 9]);
  });

  it("shows trailing pages without ellipsis when near the end", () => {
    expect(getPaginationRange(10, 9)).toEqual([0, "ellipsis", 8, 9]);
  });
});
