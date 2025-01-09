import { FieldValues, UseControllerProps, Controller } from "react-hook-form";
import { Label, Datepicker, DatepickerProps } from "flowbite-react";
import { format } from "date-fns";

class Params {
  label?: string;
  placeholderText?: string;
}
export function FormDatePicker<T extends FieldValues>(
  props: UseControllerProps<T> & DatepickerProps & Params
) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState }) => {
        return (
          <div
            className={
              props.className ||
              "grid grid-cols-12 items-center justify-between mb-2"
            }
          >
            <div className="col-span-3">
              <Label
                htmlFor={props.name}
                color={fieldState.error ? "failure" : undefined}
                value={props.label}
              />
            </div>
            <Datepicker
              {...props}
              {...field}
              className="col-span-9"
              color={fieldState.error ? "failure" : undefined}
              onSelectedDateChanged={(date) => {
                field.onChange(format(date, "yyyy-MM-dd"));
              }}
              value={format(field.value, "yyyy-MM-dd")}
              helperText={fieldState.error?.message || props.helperText}
            />
          </div>
        );
      }}
    />
  );
}
