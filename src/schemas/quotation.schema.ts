import { z } from "zod";

const CompanySchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  phoneNumber: z.string(),
  address: z.string(),
  taxID: z.string().optional(),
});

const OrderItemSchema = z.object({
  description: z.string(),
  qty: z.number(),
  amount: z.number(),
  price: z.number(),
});

export const QuotationSchema = z.object({
  title: z.string(),
  id: z.string(),
  createdAt: z.date(),
  from: CompanySchema,
  to: CompanySchema,
  items: z.array(OrderItemSchema),
});

export type Quotation = z.infer<typeof QuotationSchema>;
