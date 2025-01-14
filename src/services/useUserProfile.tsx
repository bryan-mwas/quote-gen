import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { AuthUserProfile } from "../dtos/user-profile.dto";
import { BillingCompany, ClientCompany } from "../schemas/quotation.schema";

const useUserProfile = (userId?: string) => {
  const [userClients, setUserClients] = useState<ClientCompany[]>();
  const [userCompany, setUserCompany] = useState<BillingCompany>();
  const [error, setError] = useState<string | "">();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getUserProfileData = async () => {
      const companiesRef = doc(db, "user-profiles", userId!);
      const userDoc = await getDoc(companiesRef);
      if (userDoc.exists()) {
        const profile = userDoc.data() as AuthUserProfile;
        setUserClients(profile.clients);
        setUserCompany(profile.companyInfo);
      } else {
        setIsError(true);
        setError("Data not found");
      }
    };
    if (userId) getUserProfileData();
  }, [userId]);

  // How to trigger refresh
  return { userClients, userCompany, error, isError };
};

export { useUserProfile };
