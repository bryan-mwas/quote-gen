import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, TextInput, TextInputProps } from "flowbite-react";
import { AppHTMLInputParams } from "./FormInput";
import { gridLayoutFormInput } from "../../constants";

export function FormNumberInput<T extends FieldValues>(
  props: UseControllerProps<T> & TextInputProps & AppHTMLInputParams
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div className={gridLayoutFormInput({ gridLayout: props.gridFormat })}>
      <div className="mb-2 block">
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
