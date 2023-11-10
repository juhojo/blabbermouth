import { Input } from "../../atoms/Input";
import { Typography } from "../../atoms/Typography";
import { ExclamationTriangle } from "../../tokens";

/**
 * Input field
 *
 * @param {{
 *  label: string,
 *  issues?: string,
 * }} props
 * @returns
 */
export const InputField = ({ label, issues, ...inputProps }) => (
  <label className="flex flex-col">
    <Typography level="sm">{label}</Typography>
    <Input {...inputProps} />
    {issues && (
      <div className="flex items-center gap-2 my-2 p-1 bg-gray-100 rounded">
        <ExclamationTriangle />
        <Typography level="md">{issues}</Typography>
      </div>
    )}
  </label>
);
