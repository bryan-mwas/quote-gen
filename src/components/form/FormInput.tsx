import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, TextInput, TextInputProps } from "flowbite-react";
import { gridLayoutFormInput } from "../../constants";

export interface AppHTMLInputParams {
  placeholderText?: string;
  label?: string;
  gridFormat?: boolean;
}

export default function FormInput<T extends FieldValues>(
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
        placeholder={props.placeholderText}
        color={error ? "failure" : undefined}
        helperText={error?.message || props.helperText}
        disabled={props.disabled}
      />
    </div>
  );
}

export function GridFormInput<T extends FieldValues>(
  props: UseControllerProps<T> & TextInputProps & AppHTMLInputParams
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div className="grid grid-cols-12 items-center justify-between mb-2 gap-2">
      <div className="col-span-3">
        <Label
          htmlFor={props.name}
          color={error ? "failure" : undefined}
          value={props.label}
        />
      </div>
      <TextInput
        className="col-span-9"
        id={props.name}
        {...field}
        {...props}
        placeholder={props.placeholderText}
        color={error ? "failure" : undefined}
        helperText={error?.message || props.helperText}
        disabled={props.disabled}
      />
    </div>
  );
}
