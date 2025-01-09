import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BillingCompany } from "../schemas/quotation.schema";
import createSelectors from "./selectors";

type State = {
  billingCompanyInfo?: BillingCompany;
  setBillingCompanyInfo: (billingCompany?: BillingCompany) => void;
};

const initState = {
  billingCompanyInfo: undefined,
};

const appStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        ...initState,
        setBillingCompanyInfo: (companyInfo) =>
          set(() => ({ billingCompanyInfo: companyInfo })),
      }),
      {
        name: "appStore",
      }
    )
  )
);

export const useAppStore = createSelectors(appStore);
