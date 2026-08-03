import { checkoutAddressSchema } from "./checkoutAddress.schema";

describe("checkoutAddressSchema", () => {
  const valid = {
    address: "1 Main St",
    email: "jane@example.com",
    phone: "0812345678",
  };

  it("accepts valid data", () => {
    expect(checkoutAddressSchema.safeParse(valid).success).toBe(true);
  });

  it("requires address", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, address: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Address is required");
  });

  it("rejects an invalid email", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Enter a valid email address",
    );
  });

  it("requires phone", () => {
    const result = checkoutAddressSchema.safeParse({ ...valid, phone: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Phone number is required");
  });
});
