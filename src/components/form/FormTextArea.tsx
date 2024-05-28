import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, Textarea, TextareaProps } from "flowbite-react";

interface Params {
  placeholderText?: string;
  label?: string;
}

export default function FormTextArea<T extends FieldValues>(
  props: UseControllerProps<T> & TextareaProps & Params
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div
      className={`grid grid-cols-2  items-baseline justify-between ${props.className}`}
    >
      <Label
        htmlFor={props.name}
        color={error ? "failure" : undefined}
        value={props.label}
      />
      <Textarea
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
