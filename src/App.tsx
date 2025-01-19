import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./config/firebase";
import { doc, getDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import QuotationForm from "./views/QuotationForm";
import Login from "./components/Login";
import Onboarding from "./views/Onboarding/Onboarding";
import { BillingCompany } from "./schemas/quotation.schema";
import { useAppStore } from "./config/store";
import { User } from "firebase/auth";
import { AuthUserProfile } from "./dtos/user-profile.dto";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [user, loading] = useAuthState(auth);
  const localCompanyInfo = useAppStore.use.billingCompanyInfo?.();
  const [hasUserData, setHasUserData] = useState<boolean | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>();
  const setBillingCompanyInfo = useAppStore.use.setBillingCompanyInfo();

  const validateCompanyInfo = (company: BillingCompany) => {
    return !!company.name;
  };
  const validateCompanyLogo = (company: BillingCompany) => {
    return !!company.logoURL;
  };

  async function fetchAuthUserProfile(user: User) {
    const userDocRef = doc(collection(db, "user-profiles"), user.uid);
    const userDoc = await getDoc(userDocRef);
    const companyData = userDoc.data() as AuthUserProfile;
    if (companyData.companyInfo) {
      if (!validateCompanyInfo(companyData.companyInfo)) {
        setHasUserData(false);
        setOnboardingStep(1);
      } else if (!validateCompanyLogo(companyData.companyInfo)) {
        setHasUserData(false);
        setOnboardingStep(2);
      } else {
        setHasUserData(true);
      }
      setBillingCompanyInfo(companyData.companyInfo);
    } else {
      setHasUserData(false);
    }
  }

  useEffect(() => {
    const checkUserData = async () => {
      if (localCompanyInfo) {
        if (!validateCompanyInfo(localCompanyInfo)) {
          setOnboardingStep(1);
          setHasUserData(false);
        } else if (!validateCompanyLogo(localCompanyInfo)) {
          setOnboardingStep(2);
          setHasUserData(false);
        } else {
          setHasUserData(true);
        }
      } else {
        if (user) {
          await fetchAuthUserProfile(user);
        } else {
          toast.error("Unexpected: User not found");
        }
      }
    };
    if (user) checkUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {user ? (
        <>
          <nav className="bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
              <p className="text-gray-700 font-medium">
                Welcome, {user.displayName}
              </p>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to sign out?")) {
                    auth.signOut();
                    useAppStore.use.reset();
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300"
              >
                Sign Out
              </button>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">
            {hasUserData ? (
              <QuotationForm />
            ) : (
              <Onboarding
                currentStep={onboardingStep || 1}
                handleCompletion={() => fetchAuthUserProfile(user)}
              />
            )}
          </main>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <Login />
        </div>
      )}
    </div>
  );
}

export default App;
