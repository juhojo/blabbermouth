import { Typography } from "../../atoms/Typography";

/**
 * List
 *
 * @param {{
 *  children: React.JSX.Element|React.JSX.Element[],
 *  total: number,
 * }} props
 * @returns
 */
export const List = ({ children, total }) => {
  return (
    <div className="shadow-md rounded-lg border border-gray-950 overflow-hidden mb-8">
      <div className="bg-white">
        <ul className="pt-3 pb-2">{children}</ul>
      </div>
      <div className="flex justify-end bg-gray-100 px-3 pt-2 pb-4">
        <Typography level="sm">total: {total}</Typography>
      </div>
    </div>
  );
};
