import { z } from "zod";

export const checkoutAddressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z.string().min(1, "Phone number is required"),
});

export type CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>;
