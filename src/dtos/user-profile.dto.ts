import { BillingCompany, ClientCompany } from "../schemas/quotation.schema";

export interface AuthUserProfile {
  companyInfo?: BillingCompany;
  clients?: ClientCompany[];
}
