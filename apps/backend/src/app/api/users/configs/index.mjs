import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { ConfigModel } from "../../../../db/configs/index.mjs";
import { idSchema } from "../../schema.mjs";
import fieldsApi from "./fields/index.mjs";

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

/** @param {import('hono').Context} c  */
const getConfigs = async (c) => {
  const { uid } = c.req.valid("param");

  const {
    rows,
    aggregates: { count },
  } = await ConfigModel.getRowsByUserId(uid);

  return c.json(
    {
      items: rows,
      count,
    },
    200,
  );
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}:
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
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a config.
 */

/** @param {import('hono').Context} c  */
const getConfig = async (c) => {
  const { cid } = c.req.valid("param");
  const item = await ConfigModel.getRowById(cid);

  return c.json(
    {
      item,
    },
    200,
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

/** @param {import('hono').Context} c  */
const postConfig = async (c) => {
  const { uid } = c.req.valid("param");

  await ConfigModel.createRow(uid);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/configs/{cid}:
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
 *       - name: cid
 *         in: path
 *         description: Config ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */

/** @param {import('hono').Context} c  */
const deleteConfig = async (c) => {
  const { cid } = c.req.valid("param");

  await ConfigModel.deleteRow(cid);

  return new Response(undefined, { status: 204 });
};

const configsParamsSchema = z.object({
  uid: idSchema,
});

const configParamsSchema = configsParamsSchema.extend({
  cid: idSchema,
});

configsApi.use("/", zValidator("param", configsParamsSchema));
configsApi.get("/", getConfigs);
configsApi.post("/", postConfig);

configsApi.use("/:cid", zValidator("param", configParamsSchema));
configsApi.get("/:cid", getConfig);
configsApi.delete("/:cid", deleteConfig);

configsApi.route("/:cid/fields", fieldsApi);

export default configsApi;
