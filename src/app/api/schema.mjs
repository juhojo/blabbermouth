import { z } from "zod";

export const idSchema = z.string().transform((value) => {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a number",
    });

    return z.NEVER;
  }

  return parsed;
});
