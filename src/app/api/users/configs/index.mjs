import { Hono } from "hono";
import { and, eq, sql } from "drizzle-orm";

import db from "../../../../db/index.mjs";
import { configs } from "../../../../db/schema.mjs";

const configsApi = new Hono();

/**
 * @openapi
 * /api/v1/users/{uid}/configs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - configs
 *     description: Get all user's configs.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns all configs.
 */
const getConfigs = async (c) => {
  const uid = c.req.param("uid");
  const items = await db.select().from(configs).where(eq(configs.ownerId, uid));
  const aggregates = await db
    .select({ count: sql`count(*)` })
    .from(configs)
    .where(eq(configs.ownerId, uid));

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
 * /api/v1/users/{uid}/configs/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - configs
 *     description: Get a user's config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: id
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a config.
 */
const getConfig = async (c) => {
  const uid = c.req.param("uid");
  const id = c.req.param("id");
  const items = await db
    .select()
    .from(configs)
    .where(and(eq(configs.id, id), eq(configs.ownerId, uid)));

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
 * /api/v1/users/{uid}/configs:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - configs
 *     description: Create a config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */
const postConfig = async (c) => {
  const uid = c.req.param("uid");

  await db.insert(configs).values({ ownerId: uid });

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - configs
 *     description: Delete a config.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: id
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deleteConfig = async (c) => {
  const uid = c.req.param("uid");
  const id = c.req.param("id");

  await db
    .delete(configs)
    .where(and(eq(configs.id, id), eq(configs.ownerId, uid)));

  return new Response(undefined, { status: 204 });
};

configsApi.get("/", getConfigs);
configsApi.get("/:id", getConfig);
configsApi.post("/", postConfig);
configsApi.delete("/:id", deleteConfig);

export default configsApi;
