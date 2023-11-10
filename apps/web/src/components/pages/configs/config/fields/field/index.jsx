import { z } from "zod";
import api, { validatedApiCall } from "../../../../../../api";

export const FieldAction = async ({ request, params }) => {
  switch (request.method) {
    case "DELETE":
      return await api.deleteField(params.cid, params.fid);
    case "PATCH":
      const data = Object.fromEntries(await request.formData());

      return await validatedApiCall(
        api.updateField.bind(this, params.cid, params.fid),
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
