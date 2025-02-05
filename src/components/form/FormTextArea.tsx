import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { Label, Textarea, TextareaProps } from "flowbite-react";
import { AppHTMLInputParams } from "./FormInput";

export default function FormTextArea<T extends FieldValues>(
  props: UseControllerProps<T> & TextareaProps & AppHTMLInputParams
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div>
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

export function GridFormTextArea<T extends FieldValues>(
  props: UseControllerProps<T> & TextareaProps & AppHTMLInputParams
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  return (
    <div className="grid grid-cols-12 items-baseline justify-between mb-2">
      <Label
        className="col-span-3"
        htmlFor={props.name}
        color={error ? "failure" : undefined}
        value={props.label}
      />
      <Textarea
        className="col-span-9"
        id={props.name}
        {...field}
        {...props}
        placeholder={props.placeholderText}
        color={error ? "failure" : undefined}
        disabled={props.disabled}
      />
      {(error?.message || props.helperText) && (
        <small className="text-red-500 col-span-12 text-end font-semibold">
          {error?.message || props.helperText}
        </small>
      )}
    </div>
  );
}
