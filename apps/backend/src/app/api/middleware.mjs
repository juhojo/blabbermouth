import { HTTPException } from "hono/http-exception";
import { UserModel } from "../../db/users/index.mjs";
import { isBefore } from "date-fns";

/**
 * Authorization
 *
 * Decodes JWT, and checks that the resource request is made by a user that owns the resource.
 *
 * @param {import('hono').Context} c
 * @param {import('hono').Next} next
 */
export const authorization = async (c, next) => {
  const params = c.req.param();
  const uid = parseInt(params.uid, 10);
  const decodedToken = c.get("jwtPayload");

  const row = await UserModel.getRowById(uid);

  if (!row || isBefore(new Date(decodedToken.exp), new Date())) {
    throw new HTTPException(401);
  }

  if (decodedToken.user.id !== uid) {
    throw new HTTPException(403);
  }

  await next();
};
