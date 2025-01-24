import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClientCompany,
  Quotation,
  QuotationSchema,
} from "../schemas/quotation.schema";
import FormInput, { GridFormInput } from "../components/form/FormInput";
import { GridFormTextArea } from "../components/form/FormTextArea";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { FormNumberInput } from "../components/form/FormNumberInput";
import { FormDatePicker } from "../components/form/FormDatePicker";
import QuotationReport from "./QuotationReport";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../config/store";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { useUserProfile } from "../services/useUserProfile";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "firebase/auth";
import { pdfMaker } from "../utills/pdf-generator";
import { format } from "date-fns";
import ImageUpload from "../components/form/ImageUploader";

const updateUserClients = async (user: User, client: ClientCompany) => {
  const authUserRef = doc(db, "user-profiles", user.uid);
  try {
    await updateDoc(authUserRef, {
      clients: arrayUnion(client),
    });
    console.log(`${user.displayName} has added Client: ${client.name}`);
  } catch (e) {
    console.error("An error occured");
  }
};

export default function QuotationForm() {
  const [user] = useAuthState(auth);
  const { userClients } = useUserProfile(user?.uid);
  const [updateUserCompany, setUpdateUserCompany] = useState(true);

  const billingCompanyInfo = useAppStore.use.billingCompanyInfo?.();
  const { control, handleSubmit, watch, setValue, formState } =
    useForm<Quotation>({
      resolver: zodResolver(QuotationSchema),
      defaultValues: {
        companyLogo: billingCompanyInfo?.logoURL,
        createdAt: format(new Date(), "yyyy-MM-dd"),
        from: billingCompanyInfo || {},
        to: {},
        id: "",
        items: [{ description: "", price: 0, qty: 0 }],
        title: "Quote",
      },
    });

  useEffect(() => {
    if (billingCompanyInfo) setValue("from", billingCompanyInfo);
  }, [billingCompanyInfo, setValue]);

  const pdfPreviewRef = useRef(null);

  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: Quotation) => {
    if (user && updateUserCompany) await updateUserClients(user, data.to);
    pdfMaker(data);
  };

  return (
    <Card
      className="grid sm:grid-cols-1"
      theme={{
        root: {
          children: "p-4",
        },
      }}
    >
      <h1 className="mx-4 text-2xl font-extrabold text-center mb-4">
        Quote Generator
      </h1>
      <div className="mx-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 space-y-4"
        >
          {billingCompanyInfo?.logoURL ? (
            <img
              src={billingCompanyInfo.logoURL}
              alt="Company Logo"
              className="object-cover h-32 w-32 rounded mb-2 justify-self-center"
            />
          ) : (
            <ImageUpload
              onGuestImageChange={(url) => setValue("companyLogo", url)}
            />
          )}
          <div className="grid sm:grid-cols-1">
            <div className="bg-slate-50 p-4 rounded-md">
              <GridFormInput control={control} name="id" label="Quote #" />
              <FormDatePicker control={control} name="createdAt" label="Date" />
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <section>
              <p className="text-2xl text-gray-400">From</p>
              <GridFormInput
                name={"from.name"}
                control={control}
                label="Name"
              />
              <GridFormInput
                name={"from.email"}
                control={control}
                label="E-mail"
              />
              <GridFormInput
                name={"from.phoneNumber"}
                control={control}
                label="Phone Number"
              />
              <GridFormTextArea
                name={"from.address"}
                control={control}
                label="Address"
              />
              <GridFormInput
                name={"from.taxID"}
                control={control}
                label="Tax ID/PIN"
              />
            </section>

            <section className="space-y-2">
              <p className="text-2xl text-gray-400">Bill To</p>
              <div className="grid grid-cols-1">
                <Select
                  id="clients"
                  className="flex-1 text-center"
                  addon="Choose..."
                  onChange={({ target: { value } }) => {
                    const selectedValue = userClients?.find(
                      (it) => it?.name === value
                    );
                    if (selectedValue) {
                      setUpdateUserCompany(false);
                      setValue("to", selectedValue);
                    }
                  }}
                >
                  <option id="-1">Select Company</option>
                  {userClients?.map((it, idx) => (
                    <option id={`${idx}`} value={it.name}>
                      {it.name}
                    </option>
                  ))}
                </Select>
                <small className="text-gray-600 italic">
                  If company is not in list kindly fill in the values below
                </small>
              </div>

              <GridFormInput name={"to.name"} control={control} label="Name" />
              <GridFormInput
                name={"to.email"}
                control={control}
                label="E-mail"
              />
              <GridFormInput
                name={"to.phoneNumber"}
                control={control}
                label="Phone Number"
              />
              <GridFormTextArea
                name={"to.address"}
                control={control}
                label="Address"
              />
            </section>
          </div>

          {lineItems.map((item, index) => {
            return (
              <section
                key={item.id}
                className="bg-slate-50 my-2 rounded-md p-4"
              >
                <p className="font-bold mb-3">Line Item {index + 1}</p>
                <div className="grid sm:grid-cols-1 md:grid-cols-5 gap-3 items-baseline">
                  <FormInput
                    name={`items.${index}.description` as const}
                    className="flex flex-col"
                    control={control}
                    label="Description"
                  />
                  <FormNumberInput
                    name={`items.${index}.qty` as const}
                    className="flex flex-col"
                    control={control}
                    label="Quantity"
                  />
                  <FormNumberInput
                    name={`items.${index}.price` as const}
                    className="flex flex-col"
                    control={control}
                    label="Price"
                  />
                  <div>
                    <div className="mb-2 block">
                      <Label>Amount</Label>
                    </div>
                    <TextInput
                      value={
                        watch(`items.${index}.price`) *
                        watch(`items.${index}.qty`)
                      }
                      className="font-bold"
                      readOnly
                    />
                  </div>

                  <div className="flex gap-1 items-center self-end">
                    <Button
                      size={"xs"}
                      onClick={() =>
                        append({
                          description: "",
                          qty: 0,
                          price: 0,
                        })
                      }
                    >
                      <FaPlus className="me-1 h-4 w-4" /> Line Item
                    </Button>
                    {lineItems.length > 1 ? (
                      <Button
                        size={"xs"}
                        color={"failure"}
                        onClick={() => remove(index)}
                      >
                        <FaTrash className="me-1 h-4 w-4" /> Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </section>
            );
          })}

          <section id="totals" className="float-end">
            <div className="flex flex-col gap-2 text-xl font-bold p-3">
              <p className="bg-slate-50 rounded-lg p-2">
                <span className="text-slate-600">Quote Total: </span>
                <span className="text-cyan-700">
                  {new Intl.NumberFormat("en-KE", {
                    style: "currency",
                    currency: "KES",
                  }).format(
                    watch(`items`).reduce((acc, curr) => {
                      acc += curr.price * curr.qty;
                      return acc;
                    }, 0)
                  )}
                </span>
              </p>
              <Button
                type="submit"
                pill
                disabled={formState.isSubmitting || formState.isLoading}
                isProcessing={formState.isSubmitting}
              >
                Generate Quote
              </Button>
            </div>
          </section>
        </form>
      </div>

      <div id="preview" ref={pdfPreviewRef} className="hidden">
        <QuotationReport qouteData={watch()} />
      </div>
    </Card>
  );
}
