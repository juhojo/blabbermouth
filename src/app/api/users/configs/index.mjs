import { Hono } from "hono";
import { ConfigModel } from "../../../../db/configs/index.mjs";

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
  const userId = c.req.param("uid");

  const {
    rows,
    aggregates: { count },
  } = await ConfigModel.getRowsByUserId(userId);

  return c.json(
    {
      items: rows,
      count,
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
  const id = c.req.param("id");
  const item = await ConfigModel.getRowById(id);

  return c.json(
    {
      item,
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

  await ConfigModel.createRow(uid);

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
  const id = c.req.param("id");

  await ConfigModel.deleteRow(id);

  return new Response(undefined, { status: 204 });
};

configsApi.get("/", getConfigs);
configsApi.get("/:id", getConfig);
configsApi.post("/", postConfig);
configsApi.delete("/:id", deleteConfig);

export default configsApi;
