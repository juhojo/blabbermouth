import { verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { API_JWT_SECRET } from "../../config.mjs";
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
  const bearer = c.req.header("Authorization");
  const uid = parseInt(params.uid, 10);
  const decodedToken = await verify(bearer.split("Bearer ")[1], API_JWT_SECRET);

  const user = await UserModel.getRowById(uid);

  if (
    !user ||
    decodedToken.user.id !== uid ||
    isBefore(new Date(decodedToken.exp), new Date())
  ) {
    throw new HTTPException(401);
  }

  await next();
};
