import { Hono } from "hono";
import { PasscodeModel } from "../../../../db/passcodes/index.mjs";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "../../schema.mjs";
import { z } from "zod";

const passcodesApi = new Hono();

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - passcodes
 *     description: Get a passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a passcode.
 */

/** @param {import('hono').Context} c  */
const getPasscode = async (c) => {
  const { uid } = c.req.valid("param");

  const item = await PasscodeModel.getRowByUserId(uid);

  return c.json({ item }, 200);
};

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

/** @param {import('hono').Context} c  */
const postPasscode = async (c) => {
  const { uid } = c.req.valid("param");

  await PasscodeModel.createRow(uid);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes/{pid}:
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
 *       - name: pid
 *         in: path
 *         description: Passcode ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */

/** @param {import('hono').Context} c  */
const deletePasscode = async (c) => {
  const { pid } = c.req.valid("param");

  await PasscodeModel.deleteRow(pid);

  return new Response(undefined, { status: 204 });
};

const passcodesParamsSchema = z.object({
  uid: idSchema,
});

const passcodeParamsSchema = passcodesParamsSchema.extend({
  pid: idSchema,
});

passcodesApi.use("/", zValidator("param", passcodesParamsSchema));
passcodesApi.get("/", getPasscode);
passcodesApi.post("/", postPasscode);

passcodesApi.use("/:pid", zValidator("param", passcodeParamsSchema));
passcodesApi.delete("/:pid", deletePasscode);

export default passcodesApi;
