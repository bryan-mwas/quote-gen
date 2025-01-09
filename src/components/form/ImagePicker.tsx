import { FileInput, FileInputProps, Label } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

export function ImagePicker<T extends FieldValues>(
  props: UseControllerProps<T> & FileInputProps
) {
  const {
    field,
    fieldState: { error },
  } = useController(props);

  const [preview, setPreview] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // setFileName("");
      setPreview("");
    }
  };
  return (
    <Label
      htmlFor="dropzone-file"
      className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
        error ? "border-red-300" : "border-gray-300"
      }  bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
    >
      {preview ? (
        <img src={preview} className="h-full" alt="Image preview" />
      ) : (
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Company Logo</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG (MAX. 800x400px)
          </p>
        </div>
      )}
      <FileInput
        id="dropzone-file"
        className="hidden"
        accept="image/png, image/jpeg, image/svg"
        {...field}
        color={error ? "failure" : undefined}
        onChange={(e) => {
          const uploadedFile = e.target?.files?.[0];
          if (uploadedFile) {
            field.onChange(URL.createObjectURL(uploadedFile));
            handleFileChange(e);
            // Set the field value to URL of uploaded image
          }
        }}
        value={undefined}
        helperText={error?.message || props.helperText}
      />
    </Label>
  );
}
