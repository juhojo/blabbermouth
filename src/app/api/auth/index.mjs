import { Hono } from "hono";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";
import { addHours, addSeconds } from "date-fns";
import { API_JWT_SECRET } from "../../../config.mjs";
import { UserModel } from "../../../db/users/index.mjs";
import { PasscodeModel } from "../../../db/passcodes/index.mjs";

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
const auth = async (c) => {
  const { email } = await c.req.json();

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
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Returns JWT token and expiry time.
 */
const logIn = async (c) => {
  const { email, passcode } = await c.req.json();

  const user = await UserModel.getRowWithPasscodeByEmail(email);

  if (!user) {
    throw new HTTPException(401);
  }

  if (
    parseInt(passcode, 10) !== user.passcode.value ||
    !PasscodeModel.isActive(passcode)
  ) {
    throw new HTTPException(401);
  }

  const nowDate = new Date();

  const token = await sign(
    {
      jti: createId(),
      iat: nowDate,
      nbf: addSeconds(nowDate, 10),
      exp: addHours(nowDate, 2),
      user,
    },
    API_JWT_SECRET
  );

  return c.json(
    {
      token,
    },
    200
  );
};

authApi.post("/", auth);
authApi.post("/login", logIn);

export default authApi;
