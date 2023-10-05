import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";

import db from "../../../db/index.mjs";
import { configs } from "../../../db/schema.mjs";

const configsApi = new Hono();

/**
 * @openapi
 * /api/v1/configs:
 *   get:
 *     description: Get all configs.
 *     responses:
 *       200:
 *         description: Returns all configs.
 */
const getConfigs = (c) => {
  const items = db.select().from(configs).all();
  const count = db
    .select({ count: sql`count(*)` })
    .from(configs)
    .all();

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
 * /api/v1/config/{id}:
 *   get:
 *     description: Get a config.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a config.
 */
const getConfig = async (c) => {
  const id = c.req.param("id");
  const item = await db.select().from(configs).where(eq(configs.id, id));

  return c.json(
    {
      item,
      count: 1,
    },
    200
  );
};

/**
 * @openapi
 * /api/v1/configs:
 *   post:
 *     description: Create a config.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerId:
 *                 type: integer
 *                 format: int32
 *     responses:
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */
const postConfig = async (c) => {
  const body = await c.req.json();

  await db.insert(configs).values({ ownerId: body.ownerId });

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/configs/{id}:
 *   patch:
 *     description: Update a config.
 *     parameters:
 *       - name: id
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
 *               ownerId:
 *                 type: integer
 *                 format: int32
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const patchConfig = async (c) => {
  const id = c.req.param("id");
  const { owner_id: ownerId } = c.body;

  await db.update(configs).set({ ownerId }).where(eq(configs.id, id));

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/configs/{id}:
 *   delete:
 *     description: Delete a config.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deleteConfig = async (c) => {
  const id = c.req.param("id");

  await db.delete(configs).where(eq(configs.id, id));

  return new Response(undefined, { status: 204 });
};

configsApi.get("/", getConfigs);
configsApi.get("/:id", getConfig);
configsApi.post("/", postConfig);
configsApi.patch("/:id", patchConfig);
configsApi.delete("/:id", deleteConfig);

export default configsApi;
