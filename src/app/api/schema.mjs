import { z } from "zod";

export const idSchema = z.string().transform((value, ctx) => {
  const parsed = parseInt(value, 10);

  if (isNaN(parsed) || parsed <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not an ID",
    });

    return z.NEVER;
  }

  return parsed;
});
