interface Props {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}
export const Step = ({ number, title, isActive, isCompleted }: Props) => {
  return (
    <div className="flex items-center">
      <div
        className={`
          rounded-full h-6 w-6 flex items-center justify-center text-sm
          ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
          ${isCompleted ? "bg-green-500 text-white" : ""}
        `}
      >
        {number}
      </div>
      <span
        className={`ml-1 text-sm ${
          isActive ? "text-blue-600 font-medium" : "text-gray-500"
        } ${isCompleted ? "text-green-500" : ""}`}
      >
        {title}
      </span>
    </div>
  );
};
