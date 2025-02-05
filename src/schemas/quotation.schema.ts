import { z } from "zod";

const ClientCompanyShema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  email: z.string().optional(),
  phoneNumber: z.string().trim().min(1, "Phone Number is required"),
  address: z.string().trim().min(1, "Address is required"),
  taxID: z.string().optional(),
});

export const BillingCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  email: z.string().optional(),
  logoURL: z.string().optional(),
  phoneNumber: z.string().trim().min(1, "Phone Number is required"),
  address: z.string().trim().min(1, "Address is required"),
  taxID: z.string().trim().min(1, "Tax ID is required"),
});

const OrderItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  qty: z.number().min(1, "Quantity cannot be 0"),
  price: z.number().min(1, "Price cannot be 0"),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const QuotationSchema = z.object({
  title: z.string().trim().min(1, "Quote title is required"),
  id: z.string().trim().min(1, "Quote ID is required"),
  createdAt: z.string().date(),
  companyLogo: z.string().trim().min(1, "Company Logo is required"),
  from: BillingCompanySchema,
  to: ClientCompanyShema,
  items: z.array(OrderItemSchema).min(1, "At least one line item is required"),
});

export type Quotation = z.infer<typeof QuotationSchema>;
export type BillingCompany = z.infer<typeof BillingCompanySchema>;
export type ClientCompany = z.infer<typeof ClientCompanyShema>;
