import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quotation, QuotationSchema } from "../schemas/quotation.schema";
import FormInput from "../components/form/FormInput";
import FormTextArea from "../components/form/FormTextArea";
import { Button } from "flowbite-react";

export default function QuotationForm() {
  const { control, handleSubmit } = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
    defaultValues: {
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
    <div className="flex flex-col gap-4 mx-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 sm:grid-cols-1">
          <div></div>
          <div></div>
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

        {lineItems.map((field, index) => {
          return (
            <section
              key={field.id}
              className="grid sm:grid-cols-1 md:grid-cols-4 gap-3 items-baseline bg-slate-50 p-4 my-2 rounded-md"
            >
              <FormInput
                name={`items.${index}.description` as const}
                className="flex flex-col"
                control={control}
                label="Description"
              />
              <FormInput
                name={`items.${index}.qty` as const}
                className="flex flex-col"
                control={control}
                label="Quantity"
              />
              <FormInput
                name={`items.${index}.price` as const}
                className="flex flex-col"
                control={control}
                label="Price"
              />
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
                <Button
                  size={"xs"}
                  color={"failure"}
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </div>
            </section>
          );
        })}
      </form>
    </div>
  );
}
