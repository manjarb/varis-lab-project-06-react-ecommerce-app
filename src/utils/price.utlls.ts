/**
 * Calculate the original price before the discount.
 * @param {number} price - The discounted price of the product.
 * @param {number | undefined} discountPercentage - The discount percentage (optional).
 * @returns {string} - The original price as a formatted string.
 */
export const calculateOriginalPrice = (
  price: number,
  discountPercentage?: number
): number => {
  if (
    !discountPercentage ||
    discountPercentage <= 0 ||
    discountPercentage >= 100
  ) {
    return price; // If no discount or invalid discount, return the current price
  }
  return price / (1 - discountPercentage / 100);
};
