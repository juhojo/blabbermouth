import { Hono } from "hono";
import { and, eq, sql } from "drizzle-orm";

import db from "../../../../../db/index.mjs";
import { fields } from "../../../../../db/schema.mjs";

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
  const cid = c.req.param("cid");
  const items = await db.select().from(fields).where(eq(fields.configId, cid));
  const aggregates = await db
    .select({ count: sql`count(*)` })
    .from(fields)
    .where(eq(fields.configId, cid));

  return c.json(
    {
      items,
      count: aggregates?.[0].count ?? 0,
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
  const cid = c.req.param("cid");
  const id = c.req.param("id");
  const items = await db
    .select()
    .from(fields)
    .where(and(eq(fields.configId, cid), eq(fields.id, id)));

  return c.json(
    {
      items,
      count: items.length,
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
  const body = await c.req.json();

  await db.insert(fields).values({
    configId: cid,
    key: body.key,
    value: body.value,
  });

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
  const cid = c.req.param("cid");
  const id = c.req.param("id");
  const body = await c.req.json();

  await db
    .update(fields)
    .set({ value: body.value })
    .where(and(eq(fields.configId, cid), eq(fields.id, id)));

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
  const cid = c.req.param("cid");
  const id = c.req.param("id");

  await db
    .delete(fields)
    .where(and(eq(fields.configId, cid), eq(fields.id, id)));

  return new Response(undefined, { status: 204 });
};

fieldsApi.get("/", getFields);
fieldsApi.get("/:id", getField);
fieldsApi.post("/", postField);
fieldsApi.patch("/:id", patchField);
fieldsApi.delete("/:id", deleteField);

export default fieldsApi;
