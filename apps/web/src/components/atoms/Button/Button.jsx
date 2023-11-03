const classNames = {
  filled:
    "bg-gray-300 border-gray-300 text-gray-950 hover:bg-gray-400 hover:border-gray-400 shadow",
  outlined:
    "bg-gray-100 border-gray-950 text-gray-950 hover:bg-gray-200 shadow",
  text: "bg-transparent border-transparent text-gray-950 hover:underline",
};

/**
 * Button
 *
 * @param {{
 *  variant: 'filled'|'outlined'|'text',
 *  children: React.JSX.Element|React.JSX.Element[]
 * }} props
 * @returns
 */
export const Button = ({ variant, children, ...buttonProps }) => {
  return (
    <button
      className={`px-2 py-1 border rounded lowercase ease-in-out duration-300 ${classNames[variant]}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  variant: "filled",
};
