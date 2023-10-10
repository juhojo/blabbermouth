import { Hono } from "hono";
import { FieldModel } from "../../../../../db/fields/index.mjs";

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
const getFields = async (c) => {
  const configId = c.req.param("cid");

  const {
    items,
    aggregates: { count },
  } = await FieldModel.getRowsByConfigId(configId);

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
 * /api/v1/users/{uid}/configs/{cid}/fields/{id}:
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
 *       - name: id
 *         in: path
 *         description: Field ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a field for a config.
 */
const getField = async (c) => {
  const id = c.req.param("id");

  const item = await FieldModel.getRowById(id);

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
const postField = async (c) => {
  const cid = c.req.param("cid");
  const { key, value } = await c.req.json();

  await FieldModel.createRow(cid, key, value);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields/{id}:
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
 *       - name: id
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
const patchField = async (c) => {
  const id = c.req.param("id");
  const { value } = await c.req.json();

  await FieldModel.updateRow(id, value);

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}/fields/{id}:
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
 *       - name: id
 *         in: path
 *         description: Field ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deleteField = async (c) => {
  const id = c.req.param("id");

  await FieldModel.deleteRow(id);

  return new Response(undefined, { status: 204 });
};

fieldsApi.get("/", getFields);
fieldsApi.get("/:id", getField);
fieldsApi.post("/", postField);
fieldsApi.patch("/:id", patchField);
fieldsApi.delete("/:id", deleteField);

export default fieldsApi;
