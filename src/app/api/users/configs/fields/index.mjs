import { Hono } from "hono";
import { FieldModel } from "../../../../../db/fields/index.mjs";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { idSchema } from "../../../schema.mjs";

const fieldsApi = new Hono();

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - fields
 *     description: Get all fields for a config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns all fields for a config.
 */

/** @param {import('hono').Context} c  */
const getFields = async (c) => {
  const { cid } = c.req.valid("param");

  const {
    items,
    aggregates: { count },
  } = await FieldModel.getRowsByConfigId(cid);

  return c.json(
    {
      items,
      count,
    },
    200
  );
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields/{fid}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - fields
 *     description: Get a field for a config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *       - name: fid
 *         in: path
 *         description: Field ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a field for a config.
 */

/** @param {import('hono').Context} c  */
const getField = async (c) => {
  const { fid } = c.req.valid("param");

  const item = await FieldModel.getRowById(fid);

  return c.json(
    {
      item,
    },
    200
  );
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - fields
 *     description: Create a field.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */

const postFieldBodySchema = z.object({
  key: z.string().regex(/[a-zA-Z0-9_]/),
  value: z.string(),
});

/** @param {import('hono').Context} c  */
const postField = async (c) => {
  const { cid } = c.req.valid("param");
  const { key, value } = await c.req.valid("json");

  await FieldModel.createRow(cid, key, value);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields/{fid}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - fields
 *     description: Update a field.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *       - name: fid
 *         in: path
 *         description: Field ID.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */

const patchFieldBodySchema = z.object({
  value: z.string(),
});

/** @param {import('hono').Context} c  */
const patchField = async (c) => {
  const { fid } = c.req.valid("param");
  const { value } = c.req.valid("json");

  await FieldModel.updateRow(fid, value);

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields/{fid}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - fields
 *     description: Delete a config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *       - name: fid
 *         in: path
 *         description: Field ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */

/** @param {import('hono').Context} c  */
const deleteField = async (c) => {
  const { fid } = c.req.valid("param");

  await FieldModel.deleteRow(id);

  return new Response(undefined, { status: 204 });
};

const fieldsParamsSchema = z.object({
  uid: idSchema,
  cid: idSchema,
});

const fieldParamsSchema = fieldsParamsSchema.extend({
  fid: idSchema,
});

fieldsApi.use("/", zValidator(fieldsParamsSchema));
fieldsApi.get("/", getFields);
fieldsApi.post("/", zValidator(postFieldBodySchema), postField);

fieldsApi.use("/:fid", zValidator(fieldParamsSchema));
fieldsApi.get("/:fid", getField);
fieldsApi.patch("/:fid", zValidator(patchFieldBodySchema), patchField);
fieldsApi.delete("/:fid", deleteField);

export default fieldsApi;
