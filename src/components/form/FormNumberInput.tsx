import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, TextInput, TextInputProps } from "flowbite-react";

class Params {
  placeholderText?: string;
  label?: string;
}
export function FormNumberInput<T extends FieldValues>(
  props: UseControllerProps<T> & TextInputProps & Params
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div
      className={
        props.className ||
        "grid grid-cols-2 items-baseline justify-between mb-2"
      }
    >
      <div>
        <Label
          htmlFor={props.name}
          color={error ? "failure" : undefined}
          value={props.label}
        />
      </div>
      <TextInput
        id={props.name}
        {...field}
        {...props}
        type="number"
        onChange={({ target: { value } }) => field.onChange(parseInt(value))}
        placeholder={props.placeholderText}
        color={error ? "failure" : undefined}
        helperText={error?.message || props.helperText}
        disabled={props.disabled}
      />
    </div>
  );
}
