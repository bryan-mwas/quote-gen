import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Quotation, QuotationSchema } from "../schemas/quotation.schema";
import { Label, TextInput, Textarea } from "flowbite-react";
import FormInput from "../components/form/FormInput";
import { FormNumberInput } from "../components/form/FormNumberInput";

export default function QuotationForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Quotation>({
    resolver: zodResolver(QuotationSchema),
  });

  const onSubmit = (data: Quotation) => console.log(data);

  return (
    <div className="flex flex-col gap-4 mx-4">
      <form action="">
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
            <FormInput
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
            <p className="text-2xl text-gray-400">To</p>
            <FormInput name={"to.name"} control={control} label="Name" />
            <FormInput name={"to.email"} control={control} label="E-mail" />
            <FormInput
              name={"to.phoneNumber"}
              control={control}
              label="Phone Number"
            />
            <FormInput name={"to.address"} control={control} label="Address" />
          </section>
        </div>

        <section></section>
      </form>
    </div>
  );
}
