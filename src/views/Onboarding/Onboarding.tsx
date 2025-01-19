import { Card } from "flowbite-react";
import CompanyForm from "./CompanyForm";
import ImageUpload from "../../components/form/ImageUploader";
import { useEffect, useState } from "react";
import { Step } from "./Nav";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface Props {
  currentStep: number;
  handleCompletion: () => void;
}

function Onboarding(props: Props) {
  const [currentStep, setCurrentStep] = useState(props.currentStep);
  const [user] = useAuthState(auth);

  useEffect(() => {
    setCurrentStep(props.currentStep);
  }, [props.currentStep]);

  async function updateCompanyProfileLogo(url: string) {
    if (user) {
      const userDocRef = doc(db, "user-profiles", user.uid || "");
      try {
        await updateDoc(userDocRef, {
          "companyInfo.logoURL": url,
        });
        // Trigger refresh of data and update zustand store.
        props.handleCompletion();
      } catch (error) {
        toast.error((error as Error).message);
        console.log("ERROR: ", error);
      }
    }
  }

  const steps = [
    { number: 1, title: "Details" },
    { number: 2, title: "Logo" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // const handleBack = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep((prev) => prev - 1);
  //   }
  // };

  const handleCompanyDetailsSaved = () => {
    handleNext();
  };

  return (
    <Card
      theme={{
        root: {
          children: "p-4",
        },
      }}
    >
      {/* Logo and Steps */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Company Setup</h2>
      </div>

      <div className="flex space-x-4 items-center  md:justify-center">
        {steps.map((step) => (
          <Step
            key={step.number}
            number={step.number}
            title={step.title}
            isActive={currentStep === step.number}
            isCompleted={currentStep > step.number}
          />
        ))}
      </div>

      {/* Content based on current step */}
      <div className="mt-4">
        {currentStep === 1 && (
          <CompanyForm onSuccess={handleCompanyDetailsSaved} />
        )}
        {currentStep === 2 && (
          <ImageUpload onImageUpload={updateCompanyProfileLogo} />
        )}
      </div>
    </Card>
  );
}

export default Onboarding;
