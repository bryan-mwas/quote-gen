import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, TextInput, TextInputProps } from "flowbite-react";

interface Params {
  placeholderText?: string;
  label?: string;
}

export default function FormInput<T extends FieldValues>(
  props: UseControllerProps<T> & TextInputProps & Params
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div
      className={`flex gap-1 items-baseline justify-between ${
        props.className || ""
      }`}
    >
      <Label
        htmlFor={props.name}
        color={error ? "failure" : undefined}
        value={props.label}
      />
      <TextInput
        id={props.name}
        {...field}
        {...props}
        placeholder={props.placeholderText}
        color={error ? "failure" : undefined}
        helperText={error?.message || props.helperText}
        disabled={props.disabled}
        className="mb-2"
      />
    </div>
  );
}
