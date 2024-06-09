import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quotation, QuotationSchema } from "../schemas/quotation.schema";
import FormInput from "../components/form/FormInput";
import FormTextArea from "../components/form/FormTextArea";
import { Button, Label, TextInput } from "flowbite-react";
import { FormNumberInput } from "../components/form/FormNumberInput";
import { FormDatePicker } from "../components/form/FormDatePicker";
import QuotationReport from "./QuotationReport";
import jsPDF from "jspdf";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { ImagePicker } from "../components/form/ImagePicker";
import { SAMPLE_DATA } from "../schemas/sample-data";

export default function QuotationForm() {
  const { control, handleSubmit, watch } = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
    defaultValues: SAMPLE_DATA,
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
    const doc = new jsPDF({ orientation: "p", format: "a4" });

    html2canvas(pdfPreviewRef.current as unknown as HTMLElement, {
      scale: 2,
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
    console.log(data);
    console.log("Generating PDF...");
    generatePDF(data.from.name, data.to.name, data.createdAt);
  };

  return (
    <div className="grid sm:grid-cols-1 p-4">
      <h1 className="mx-4 text-4xl font-extrabold text-center">
        Quote Generator Tool
      </h1>
      <div className="flex flex-col gap-4 mx-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-1">
            <div className="bg-slate-50 p-4 my-2 rounded-md">
              <FormInput control={control} name="id" label="Quote #" />
              <FormDatePicker control={control} name="createdAt" label="Date" />
              <ImagePicker control={control} name="companyLogo" />
            </div>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <p className="text-2xl text-gray-400">From</p>
              <FormInput name={"from.name"} control={control} label="Name" />
              <FormInput name={"from.email"} control={control} label="E-mail" />
              <FormInput
                name={"from.phoneNumber"}
                control={control}
                label="Phone Number"
              />
              <FormTextArea
                name={"from.address"}
                control={control}
                label="Address"
              />
              <FormInput
                name={"from.taxID"}
                control={control}
                label="Tax ID/PIN"
              />
            </section>

            <section>
              <p className="text-2xl text-gray-400">Bill To</p>
              <FormInput name={"to.name"} control={control} label="Name" />
              <FormInput name={"to.email"} control={control} label="E-mail" />
              <FormInput
                name={"to.phoneNumber"}
                control={control}
                label="Phone Number"
              />
              <FormTextArea
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
                className="bg-slate-50 p-4 my-2 rounded-md"
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
                    <Label>Amount</Label>
                    <TextInput
                      value={
                        watch(`items.${index}.price`) *
                        watch(`items.${index}.qty`)
                      }
                      className="font-bold"
                      readOnly
                    />
                  </div>
                  <div className="flex gap-1 items-center self-center">
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
                      Append
                    </Button>
                    {lineItems.length > 1 ? (
                      <Button
                        size={"xs"}
                        color={"failure"}
                        onClick={() => remove(index)}
                      >
                        Remove
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

      <div id="preview" ref={pdfPreviewRef}>
        <QuotationReport qouteData={watch()} />
      </div>
    </div>
  );
}
