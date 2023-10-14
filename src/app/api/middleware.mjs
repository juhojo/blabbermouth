import { verify } from "hono/jwt";
import { API_JWT_SECRET } from "../../config.mjs";
import { HTTPException } from "hono/http-exception";
import { UserModel } from "../../db/users/index.mjs";

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

  if (!user || decodedToken.user.id !== uid) {
    throw new HTTPException(401);
  }

  await next();
};
