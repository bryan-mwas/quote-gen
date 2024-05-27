import { z } from "zod";

const Company = z.object({
  name: z.string(),
  postAddress: z.string(),
  phoneNumber: z.string(),
  physicalAddress: z.string(),
});

const OrderItem = z.object({
  name: z.string(),
  qty: z.number(),
  price: z.number(),
});

const Quotation = z.object({
  from: Company,
  to: Company,
  items: z.array(OrderItem),
});
