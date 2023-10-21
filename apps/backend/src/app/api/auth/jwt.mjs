import { sign } from "hono/jwt";
import { addHours, addSeconds } from "date-fns";
import { createId } from "@paralleldrive/cuid2";
import { API_JWT_SECRET } from "../../../config.mjs";

/**
 * Create a JWT
 *
 * @param {import("@blabbermouth/db").schema.UserWithPasscode} user
 * @param {Date} nowDate
 * @returns A tuple with token and expiry date
 */
export const createToken = async (user, nowDate) => {
  const exp = addHours(nowDate, 2);

  return [
    await sign(
      {
        jti: createId(),
        iat: nowDate,
        nbf: addSeconds(nowDate, 10),
        exp,
        user,
      },
      API_JWT_SECRET,
    ),
    exp,
  ];
};
