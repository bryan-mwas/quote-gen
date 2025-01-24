import { createFileRoute } from "@tanstack/react-router";
import { User } from "firebase/auth";
import { doc, collection, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { auth, db } from "../config/firebase";
import { useAppStore } from "../config/store";
import { AuthUserProfile } from "../dtos/user-profile.dto";
import { BillingCompany } from "../schemas/quotation.schema";
import Onboarding from "../views/Onboarding/Onboarding";
import QuotationForm from "../views/QuotationForm";

export const Route = createFileRoute("/_auth/")({
  component: Index,
});

function Index() {
  const [user, loading] = useAuthState(auth);
  const localCompanyInfo = useAppStore.use.billingCompanyInfo?.();
  const [hasUserData, setHasUserData] = useState<boolean | null>(null);
  const [isFetchingUserData, setFetchingUserData] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>();
  const setBillingCompanyInfo = useAppStore.use.setBillingCompanyInfo();

  const validateCompanyInfo = (company: BillingCompany) => {
    return !!company.name;
  };
  const validateCompanyLogo = (company: BillingCompany) => {
    return !!company.logoURL;
  };

  const checkAuthUserProfileData = (company: BillingCompany) => {
    if (!validateCompanyInfo(company)) {
      return 1;
    } else if (!validateCompanyLogo(company)) {
      return 2;
    } else {
      return true;
    }
  };

  async function fetchAuthUserProfile(user: User) {
    const userDocRef = doc(collection(db, "user-profiles"), user.uid);
    const userDoc = await getDoc(userDocRef);
    const companyData = userDoc.data() as AuthUserProfile;
    if (companyData && companyData.companyInfo) {
      const validationResponse = checkAuthUserProfileData(
        companyData.companyInfo
      );
      if (typeof validationResponse === "number") {
        setHasUserData(false);
        setOnboardingStep(validationResponse);
      } else {
        setHasUserData(true);
        setBillingCompanyInfo(companyData.companyInfo);
      }
    } else {
      setHasUserData(false);
    }
  }

  const checkUserData = async () => {
    setFetchingUserData(true);
    if (localCompanyInfo) {
      const validationResponse = checkAuthUserProfileData(localCompanyInfo);
      setFetchingUserData(false);
      if (typeof validationResponse === "number") {
        setHasUserData(false);
        setOnboardingStep(validationResponse);
      } else {
        setHasUserData(true);
      }
    } else {
      if (user) {
        await fetchAuthUserProfile(user);
        setFetchingUserData(false);
      } else {
        toast.error("Unexpected: User not found");
      }
    }
  };

  useEffect(() => {
    if (user) checkUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading || isFetchingUserData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  return (
    <>
      {hasUserData ? (
        <QuotationForm />
      ) : (
        <Onboarding
          currentStep={onboardingStep || 1}
          handleCompletion={() => fetchAuthUserProfile(user!)}
        />
      )}
      ;
    </>
  );
}
