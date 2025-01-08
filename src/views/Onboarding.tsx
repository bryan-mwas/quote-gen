import { useForm } from "react-hook-form";
import FormInput from "../components/form/FormInput";
import FormTextArea from "../components/form/FormTextArea.1";
import { BillingCompany } from "../schemas/quotation.schema";

function CompanyForm() {
  const { control } = useForm<BillingCompany>();
  return (
    <section className="card">
      <FormInput name={"name"} control={control} label="Name" />
      <FormInput name={"email"} control={control} label="E-mail" />
      <FormInput name={"phoneNumber"} control={control} label="Phone Number" />
      <FormTextArea name={"address"} control={control} label="Address" />
      <FormInput name={"taxID"} control={control} label="Tax ID/PIN" />
    </section>
  );
}

function Onboarding() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Steps */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Quote Generator</h2>
          <div className="flex justify-center space-x-8 mt-6">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm">
                1
              </div>
              <span className="ml-2 text-sm text-blue-600 font-medium">
                Personal
              </span>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Account</span>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-200 text-gray-700 rounded-full h-6 w-6 flex items-center justify-center text-sm">
                3
              </div>
              <span className="ml-2 text-sm text-gray-500">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <CompanyForm />
      </div>
    </div>
  );
}

export default Onboarding;
