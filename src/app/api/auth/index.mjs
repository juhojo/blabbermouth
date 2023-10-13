import { z } from "zod";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";
import { addHours, addSeconds } from "date-fns";

import { API_JWT_SECRET } from "../../../config.mjs";
import { UserModel } from "../../../db/users/index.mjs";
import { PasscodeModel } from "../../../db/passcodes/index.mjs";
import { PASSCODE_MAX, PASSCODE_MIN } from "../../../db/schema.mjs";
import { zValidator } from "@hono/zod-validator";

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

  // TODO: Move all this JWT stuff to elsewhere
  const nowDate = new Date();
  const exp = addHours(nowDate, 2);

  const token = await sign(
    {
      jti: createId(),
      iat: nowDate,
      nbf: addSeconds(nowDate, 10),
      exp,
      user,
    },
    API_JWT_SECRET
  );

  return c.json(
    {
      token,
      exp,
    },
    200
  );
};

authApi.post("/", zValidator("json", authBodySchema), auth);
authApi.post("/login", zValidator("json", logInBodySchema), logIn);

export default authApi;
