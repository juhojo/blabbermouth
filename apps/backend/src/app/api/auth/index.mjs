import { z } from "zod";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { verify } from "hono/jwt";
import { createToken } from "./jwt.mjs";
import { PASSCODE_MAX, PASSCODE_MIN } from "../../../db/schema.mjs";
import { UserModel } from "../../../db/users/index.mjs";
import { PasscodeModel } from "../../../db/passcodes/index.mjs";
import { API_JWT_SECRET } from "../../../config.mjs";
import { isAfter } from "date-fns";

const authApi = new Hono();

/**
 * @openapi
 * /api/v1/auth:
 *   post:
 *     tags:
 *       - auth
 *     description: Send an email with passcode.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         $ref: '#/components/responses/EmptyResponse'
 */

const authBodySchema = z.object({
  email: z.string().email(),
});

/** @param {import('hono').Context} c  */
const auth = async (c) => {
  const { email } = c.req.valid("json");

  const user = await UserModel.getOrCreateRow(email);
  const passcode = await PasscodeModel.createRow(user.id);

  console.log(passcode);

  // TODO: Send email with passcode to email
  return c.json({}, 200);
};

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     description: Login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *               passcode:
 *                 type: integer
 *                 format: int32
 *                 required: true
 *     responses:
 *       200:
 *         description: Returns JWT token and expiry time.
 */

const logInBodySchema = z.object({
  email: z.string().email(),
  passcode: z.number().int().min(PASSCODE_MIN).max(PASSCODE_MAX),
});

/** @param {import('hono').Context} c  */
const logIn = async (c) => {
  const { email, passcode } = c.req.valid("json");

  const row = await UserModel.getRowWithPasscodeByEmail(email);

  if (
    !row ||
    parseInt(passcode, 10) !== row.passcode.value ||
    !PasscodeModel.isActive(passcode)
  ) {
    throw new HTTPException(401);
  }

  const nowDate = new Date();
  const [token, exp] = await createToken(row, nowDate);

  return c.json(
    {
      token,
      exp,
      user: {
        id: row.id,
        email: row.email,
      },
    },
    200,
  );
};

const validateQuerySchema = z.object({
  token: z.string(),
});

/** @param {import('hono').Context} c  */
const validate = async (c) => {
  const { token } = c.req.valid("query");
  const decodedToken = await verify(token, API_JWT_SECRET).catch(() => ({}));

  return c.json(
    {
      valid:
        Boolean(decodedToken.user) &&
        Boolean(decodedToken.exp) &&
        isAfter(new Date(decodedToken.exp), new Date()),
    },
    200,
  );
};

authApi.post("/", zValidator("json", authBodySchema), auth);
authApi.post("/login", zValidator("json", logInBodySchema), logIn);
authApi.get("/validate", zValidator("query", validateQuerySchema), validate);

export default authApi;
