import { z } from "zod";
import api, { validatedApiCall } from "../../../../../api";

export const FieldsAction = async ({ request, params }) => {
  switch (request.method) {
    case "POST":
      const data = Object.fromEntries(await request.formData());

      return await validatedApiCall(
        api.createField.bind(this, params.cid),
        z.object({
          key: z
            .string()
            .regex(
              /^[a-zA-Z0-9_]+$/,
              "Key can contain only letters from a to z, integers and underscores",
            ),
          value: z.string(),
        }),
      )(data);
    default:
      return null;
  }
};
