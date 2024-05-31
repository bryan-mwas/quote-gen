import { z } from "zod";

const ClientCompanyShema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phoneNumber: z.string(),
  address: z.string(),
  taxID: z.string().optional(),
});

const BillingCompanySchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phoneNumber: z.string(),
  address: z.string(),
  taxID: z.string(),
});

const OrderItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: z.number().min(1, "The minimum quantity is 1"),
  price: z.number().min(1, "The minimum price is 1"),
});

export const QuotationSchema = z.object({
  title: z.string(),
  id: z.string(),
  createdAt: z.string().date(),
  from: BillingCompanySchema,
  to: ClientCompanyShema,
  items: z.array(OrderItemSchema),
});

export type Quotation = z.infer<typeof QuotationSchema>;
