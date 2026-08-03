export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}
