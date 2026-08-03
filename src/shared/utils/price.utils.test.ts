import { calculateOriginalPrice } from "./price.utils";

describe("calculateOriginalPrice", () => {
  it("computes the pre-discount price", () => {
    expect(calculateOriginalPrice(90, 10)).toBeCloseTo(100);
  });

  it("returns the price unchanged when there is no discount", () => {
    expect(calculateOriginalPrice(50, undefined)).toBe(50);
    expect(calculateOriginalPrice(50, 0)).toBe(50);
    expect(calculateOriginalPrice(50, 100)).toBe(50);
  });
});
