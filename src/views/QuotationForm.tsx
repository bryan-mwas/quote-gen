import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quotation, QuotationSchema } from "../schemas/quotation.schema";
import FormInput from "../components/form/FormInput";
import FormTextArea from "../components/form/FormTextArea";
import { Button, Label, TextInput } from "flowbite-react";
import { FormNumberInput } from "../components/form/FormNumberInput";
import { FormDatePicker } from "../components/form/FormDatePicker";
import { format } from "date-fns";
import QuotationReport from "./QuotationReport";

export default function QuotationForm() {
  const { control, handleSubmit, watch } = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
    defaultValues: {
      title: "Quotation",
      id: crypto.randomUUID(),
      createdAt: format(new Date(), "yyyy-MM-dd"),
      from: {},
      to: {},
      items: [{ description: "", price: 0, qty: 0 }],
    },
  });

  const {
    fields: lineItems,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = (data: Quotation) => console.log(data);

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col gap-4 mx-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-1">
            <div className="bg-slate-50 p-4 my-2 rounded-md">
              <FormInput control={control} name="id" readOnly label="Quote #" />
              <FormDatePicker control={control} name="createdAt" label="Date" />
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
                Next
              </Button>
            </div>
          </section>
        </form>
      </div>

      <div id="preview">
        <QuotationReport qouteData={watch()} />
      </div>
    </div>
  );
}
