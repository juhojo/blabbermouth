import { Hono } from "hono";
import { sign } from "hono/jwt";

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
  const body = await c.req.json();

  let userRows = await UserModel.getRowsByEmail(body.email);

  // Create user if not exist
  if (!userRows.length) {
    userRows = await UserModel.createRow(body.email);
  }

  // Create a passcode
  const passcodeRows = await PasscodeModel.createRow(userRows[0].id);

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
 *     responses:
 *       200:
 *         description: Returns JWT token and expiry time.
 */
const logIn = async (c) => {
  const body = c.req.json(); // email and passcode

  // TODO: Check passcode validity
  // TODO: Fetch user info and set as JWT payload

  const token = await sign(
    {
      // TODO: Add jti, exp, nbf and iat claims
      email: body.email,
    },
    API_JWT_SECRET
  );

  return c.json(
    {
      token,
      expire: 123456789, // TODO
    },
    200
  );
};

authApi.post("/", auth);
authApi.post("/login", logIn);

export default authApi;
