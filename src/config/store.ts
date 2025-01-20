import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BillingCompany } from "../schemas/quotation.schema";
import createSelectors from "./selectors";

type State = {
  billingCompanyInfo?: BillingCompany;
};

type Actions = {
  reset: () => void;
  setBillingCompanyInfo: (billingCompany?: BillingCompany) => void;
};

const initialState: State = {
  billingCompanyInfo: undefined,
};

const appStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setBillingCompanyInfo: (companyInfo) =>
          set(() => ({ billingCompanyInfo: companyInfo })),
        reset: () => {
          set(initialState);
        },
      }),
      {
        name: "appStore",
        version: 0.2,
      }
    )
  )
);

export const useAppStore = createSelectors(appStore);
