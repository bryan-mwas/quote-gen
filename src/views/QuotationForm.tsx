import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quotation, QuotationSchema } from "../schemas/quotation.schema";
import FormInput, { GridFormInput } from "../components/form/FormInput";
import { GridFormTextArea } from "../components/form/FormTextArea";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { FormNumberInput } from "../components/form/FormNumberInput";
import { FormDatePicker } from "../components/form/FormDatePicker";
import QuotationReport from "./QuotationReport";
import jsPDF from "jspdf";
import { useRef } from "react";
import html2canvas from "html2canvas";
// import { SAMPLE_DATA } from "../schemas/sample-data";
import { format } from "date-fns";
import { useAppStore } from "../config/store";
import { FaTrash, FaPlus } from "react-icons/fa6";

export default function QuotationForm() {
  const billingCompanyInfo = useAppStore.use.billingCompanyInfo?.();
  const { control, handleSubmit, watch } = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
    defaultValues: {
      companyLogo: undefined,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      from: billingCompanyInfo || {},
      to: {},
      id: "",
      items: [{ description: "", price: 0, qty: 0 }],
      title: "Quote",
    },
  });

  const pdfPreviewRef = useRef(null);

  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const generatePDF = (
    companyName: string,
    recipient: string,
    quoteDate: string
  ) => {
    const doc = new jsPDF({ orientation: "p", format: "a4", unit: "pt" });
    const a = pdfPreviewRef.current as unknown as HTMLElement;
    a.classList.remove("hidden");

    html2canvas(a, {
      scale: 2.5,
    }).then((canvas) => {
      const dataURI = canvas.toDataURL("image/jpeg");
      const pageWidth = doc.internal.pageSize.getWidth();
      // const pageHeight = doc.internal.pageSize.getHeight();

      // const widthRatio = pageWidth / canvas.width;
      // const heightRatio = pageHeight / canvas.height;
      // const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      // const canvasWidth = canvas.width * ratio;

      doc.addImage(dataURI, "JPEG", 0, 0, pageWidth, 0);

      // doc.output("dataurlnewwindow");
      doc.save(`Quote-${companyName}-${recipient}-${quoteDate}`);
    });
  };

  const onSubmit = (data: Quotation) => {
    // Once valid data is available only then can we generate the quote
    console.log("Generating PDF...");
    generatePDF(data.from.name, data.to.name, data.createdAt);
  };

  return (
    <Card className="grid sm:grid-cols-1 p-2">
      <h1 className="mx-4 text-2xl font-extrabold text-center m4-8">
        Invoice/Quote Generator
      </h1>
      <div className="mx-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 space-y-1"
        >
          <img
            src={billingCompanyInfo?.logoURL}
            alt="Company Logo"
            className="object-cover h-24 w-32 rounded-lg mb-2 justify-self-center"
          />
          <div className="grid sm:grid-cols-1">
            <div className="bg-slate-50 p-4 rounded-md">
              <GridFormInput control={control} name="id" label="Quote #" />
              <FormDatePicker control={control} name="createdAt" label="Date" />
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 my-4">
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
                gridFormat
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

            <section>
              <p className="text-2xl text-gray-400">Bill To</p>
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
                <p className="font-bold mb-3">Product {index + 1}</p>
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
              <Button type="submit" pill>
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
