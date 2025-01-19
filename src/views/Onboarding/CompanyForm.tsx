import { setDoc, doc } from "firebase/firestore";
import { Button } from "flowbite-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import FormTextArea from "../../components/form/FormTextArea";
import { auth, db } from "../../config/firebase";
import {
  BillingCompany,
  BillingCompanySchema,
} from "../../schemas/quotation.schema";
import FormInput from "../../components/form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface Props {
  onSuccess: () => void;
}
function CompanyForm(props: Props) {
  const [user] = useAuthState(auth);
  const { control, handleSubmit } = useForm<BillingCompany>({
    resolver: zodResolver(BillingCompanySchema),
  });

  if (!user) return <p>Not Authenticated</p>;

  const writeToFirestore = async (companyData: BillingCompany) => {
    try {
      await setDoc(doc(db, "user-profiles", user.uid), {
        companyInfo: companyData,
      });
      toast.success("Company info saved.");
      props.onSuccess();
    } catch (error) {
      toast.error(`WRITE to Firestore failed: ${error}`);
      console.error("WRITE to Firestore failed: ", error);
    }
  };
  const onSubmit = async (companyData: BillingCompany) => {
    // Write to Firestore
    writeToFirestore(companyData);
  };
  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <FormInput name={"name"} control={control} label="Company Name" />
      <FormInput name={"email"} control={control} label="Company E-mail" />
      <FormInput
        name={"phoneNumber"}
        control={control}
        label="Company Phone Number"
      />
      <FormTextArea
        name={"address"}
        control={control}
        label="Company Address"
      />
      <FormInput name={"taxID"} control={control} label=" Company Tax ID/PIN" />
      <Button type="submit" className="mt-4">
        Next
      </Button>
    </form>
  );
}

export default CompanyForm;
