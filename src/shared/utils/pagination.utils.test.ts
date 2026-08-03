import { calculateOffset, calculateTotalPages } from "./pagination.utils";

describe("calculateOffset", () => {
  it("returns 0 for the first page", () => {
    expect(calculateOffset(1, 20)).toBe(0);
  });

  it("returns limit * (page - 1) for later pages", () => {
    expect(calculateOffset(3, 20)).toBe(40);
  });
});

describe("calculateTotalPages", () => {
  it("rounds up partial pages", () => {
    expect(calculateTotalPages(101, 20)).toBe(6);
  });

  it("handles exact division", () => {
    expect(calculateTotalPages(100, 20)).toBe(5);
  });
});
