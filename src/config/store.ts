import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BillingCompany } from "../schemas/quotation.schema";
import createSelectors from "./selectors";

type State = {
  billingCompanyInfo?: BillingCompany | null;
  setBillingCompanyInfo: (billingCompany?: BillingCompany) => void;
  reset: () => void;
};

const initState = {
  billingCompanyInfo: null,
};

const appStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        ...initState,
        setBillingCompanyInfo: (companyInfo) =>
          set(() => ({ billingCompanyInfo: companyInfo })),
        reset: () => {
          set(initState);
        },
      }),
      {
        name: "appStore",
        version: 0.1,
      }
    )
  )
);

export const useAppStore = createSelectors(appStore);
