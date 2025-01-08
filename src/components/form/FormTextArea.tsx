import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, Textarea, TextareaProps } from "flowbite-react";
import { AppHTMLInputParams } from "./FormInput";
import { gridLayoutFormInput } from "../../constants";

export default function FormTextArea<T extends FieldValues>(
  props: UseControllerProps<T> & TextareaProps & AppHTMLInputParams
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
      <Textarea
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
