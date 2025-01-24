import { useState, useRef, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import { handleFileCloudStorageUpload } from "../../config/handleCloudStorageUpload";
import { validateImageFileSize } from "../../utills/fileValidator";
import toast from "react-hot-toast";

interface Props {
  onImageUpload?: (x: string) => void;
  onGuestImageChange?: (x: string) => void;
}

const ImageUpload = ({ onImageUpload, onGuestImageChange }: Props) => {
  const [preview, setPreview] = useState("");
  const [filename, setFilename] = useState("");
  const [file, setFile] = useState<File>();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      const { isValid, message } = await validateImageFileSize(file, 250);
      if (file && isValid) {
        setFile(file);
        setFilename(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Img = e.target?.result as string;
          setPreview(base64Img);
          onGuestImageChange?.(base64Img);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(message);
        handleRemoveImage();
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleImageClick = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Handle upload logic here
    if (file) {
      handleFileCloudStorageUpload(
        file,
        onImageUpload!,
        console.log,
        toast.error
      );
    } else alert("Choose company logo to proceed");
  };

  const handleRemoveImage = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation();
    }
    setPreview("");
    setFilename("");
    setFile(undefined);
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  };

  return (
    // <section className="w-full mx-auto items-center ">
    <div className="max-w-sm mx-auto bg-white items-center">
      <div className="px-4 py-6">
        <div
          onClick={handleImageClick}
          className={`relative max-w-sm p-6 mb-4 bg-gray-100 rounded-lg items-center mx-auto text-center cursor-pointer ${
            !preview ? "border-dashed border-2 border-gray-400" : ""
          }`}
        >
          {preview && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <input
            ref={uploadInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />

          {!preview ? (
            <>
              <Upload className="w-8 h-8 text-gray-700 mx-auto mb-4" />
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload picture
              </h5>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                Choose photo size should be less than{" "}
                <b className="text-gray-600">250KB</b>
              </p>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                and should be in <b className="text-gray-600">JPG or PNG</b>{" "}
                format.
              </p>
            </>
          ) : (
            <img
              src={preview}
              className="max-h-48 rounded-lg mx-auto"
              alt="Image preview"
            />
          )}
          {filename && (
            <span className="text-gray-500 bg-gray-200 z-50 mt-2 inline-block px-2 py-1 rounded">
              {filename}
            </span>
          )}
        </div>

        {!onGuestImageChange && (
          <div className="flex items-center justify-center">
            <div className="w-full">
              <button
                onClick={handleUploadClick}
                className="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2"
              >
                <span className="text-center ml-2">Upload</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    // </section>
  );
};

export default ImageUpload;
