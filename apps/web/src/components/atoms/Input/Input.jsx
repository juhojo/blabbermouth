import { forwardRef } from "react";

export const Input = forwardRef(({ ...inputProps }, ref) => {
  return (
    <input
      ref={ref}
      className="border rounded border-gray-950 p-1 shadow-inner w-full"
      {...inputProps}
    />
  );
});
