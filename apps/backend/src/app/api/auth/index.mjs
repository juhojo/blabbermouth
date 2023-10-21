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
import { isBefore } from "date-fns";

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

  const user = await UserModel.getRowWithPasscodeByEmail(email);

  if (
    !user ||
    parseInt(passcode, 10) !== user.passcode.value ||
    !PasscodeModel.isActive(passcode)
  ) {
    throw new HTTPException(401);
  }

  const nowDate = new Date();
  const [token, exp] = await createToken(user, nowDate);

  return c.json(
    {
      token,
      exp,
      user: {
        id: user.id,
        email: user.email,
      },
    },
    200,
  );
};

/** @param {import('hono').Context} c  */
const validate = async (c) => {
  const token = c.req.query("token");
  const decodedToken = await verify(token, API_JWT_SECRET);

  if (!decodedToken.user || isBefore(new Date(decodedToken.exp), new Date())) {
    throw new HTTPException(401);
  }

  return c.json(
    {
      valid: true,
    },
    200,
  );
};

authApi.post("/", zValidator("json", authBodySchema), auth);
authApi.post("/login", zValidator("json", logInBodySchema), logIn);
authApi.get("/validate", validate);

export default authApi;
