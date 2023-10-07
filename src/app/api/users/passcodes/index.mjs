import { Hono } from "hono";
import { and, desc, eq, sql } from "drizzle-orm";

import { PasscodeModel } from "../../../../db/passcodes/index.mjs";

const passcodesApi = new Hono();

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - passcodes
 *     description: Create a passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */
const postPasscode = async (c) => {
  const uid = c.req.param("uid");

  await PasscodeModel.createRow(uid);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - passcodes
 *     description: Delete a passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: id
 *         in: path
 *         description: Passcode ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deletePasscode = async (c) => {
  const uid = c.req.param("uid");
  const id = c.req.param("id");

  await PasscodeModel.deleteRow(id);

  return new Response(undefined, { status: 204 });
};

passcodesApi.post("/", postPasscode);
passcodesApi.delete("/:id", deletePasscode);

export default passcodesApi;