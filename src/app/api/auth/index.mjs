import { z } from "zod";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";
import { addHours, addSeconds } from "date-fns";
import { API_JWT_SECRET } from "../../../config.mjs";
import { UserModel } from "../../../db/users/index.mjs";
import { PasscodeModel } from "../../../db/passcodes/index.mjs";
import { parseMiddleware } from "../util.mjs";

const authApi = new Hono();

const parseAuthRequest = async (c, next) => {
  const bodySchema = z.object({
    email: z.email(),
  });

  await parseMiddleware(await c.req.json(), bodySchema, next);
};

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

const parseLoginRequest = async (c, next) => {
  const bodySchema = z.object({
    email: z.email(),
    passcode: z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed) || parsed < 1000 || parsed > 9999) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Not a valid passcode",
        });

        return z.NEVER;
      }

      return parsed;
    }),
  });

  await parseMiddleware(await c.req.json(), bodySchema, next);
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

  if (
    !user ||
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

authApi.use("/", parseAuthRequest);
authApi.post("/", auth);
authApi.use("/login", parseLoginRequest);
authApi.post("/login", logIn);

export default authApi;
