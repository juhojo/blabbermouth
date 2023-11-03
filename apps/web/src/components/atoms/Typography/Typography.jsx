import { forwardRef } from "react";

/**
 * Typography
 *
 * @param {{
 *  className: string,
 *  level: 'h1'|'h2'|'h2'|'h3'|'h4'|'xs'|'sm'|'md',
 *  children: React.JSX.Element|React.JSX.Element[]
 * }} props
 *
 * @returns
 */
export const Typography = forwardRef(
  ({ className, level, children, ...inlineProps }, ref) => {
    switch (level) {
      case "h1":
        return (
          <h1
            ref={ref}
            className={`lowercase text-gray-950 text-3xl mb-16 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </h1>
        );
      case "h2":
        return (
          <h2
            ref={ref}
            className={`lowercase text-gray-950 text-2xl mb-8 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </h2>
        );
      case "h3":
        return (
          <h3
            ref={ref}
            className={`lowercase text-gray-950 text-xl mb-4 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </h3>
        );
      case "h4":
        return (
          <h4
            ref={ref}
            className={`lowercase text-gray-950 text-lg mb-2 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </h4>
        );
      case "xs":
        return (
          <span
            ref={ref}
            className={`lowercase text-gray-950 text-xs mb-px ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </span>
        );
      case "sm":
        return (
          <span
            ref={ref}
            className={`lowercase text-gray-950 text-sm mb-0.5 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </span>
        );
      case "md":
      default:
        return (
          <span
            ref={ref}
            className={`lowercase text-gray-950 text-base mb-1 ${
              className ?? ""
            }`}
            {...inlineProps}
          >
            {children}
          </span>
        );
    }
  },
);
