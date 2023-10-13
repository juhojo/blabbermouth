import { Hono } from "hono";
import { UserModel } from "../../../db/users/index.mjs";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "../schema.mjs";

const usersApi = new Hono();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Get all users.
 *     responses:
 *       200:
 *         description: Returns all users.
 */

/** @param {import('hono').Context} c  */
const getUsers = (c) => {
  const {
    rows,
    aggregates: { count },
  } = UserModel.getAll();

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
 * /api/v1/users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Create a user.
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
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */

const postUserBodySchema = z.object({
  email: z.string().email(),
});

/** @param {import('hono').Context} c  */
const postUser = async (c) => {
  const { email } = c.req.valid("json");

  await UserModel.createRow(email);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Get a user.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a user.
 */

/** @param {import('hono').Context} c  */
const getUser = async (c) => {
  const { uid } = c.req.valid("param");
  const user = await UserModel.getRowById(uid);

  return c.json(
    {
      item: user,
    },
    200
  );
};

/**
 * @openapi
 * /api/v1/users/{uid}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Update a user.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 *
 */

const patchUserBodySchema = z.object({
  email: z.string().email(),
});

/** @param {import('hono').Context} c  */
const patchUser = async (c) => {
  const { uid } = c.req.valid("param");
  const { email } = c.req.valid("json");

  await UserModel.updateRow(uid, email);

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{uid}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Delete a user.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */

/** @param {import('hono').Context} c  */
const deleteUser = async (c) => {
  const { uid } = c.req.valid("param");

  await UserModel.deleteRow(uid);

  return new Response(undefined, { status: 204 });
};

const userParamsSchema = z.object({
  uid: idSchema,
});

// TODO: Move these two as /admin/ endpoints
usersApi.get("/", getUsers);
usersApi.post("/", zValidator("json", postUserBodySchema), postUser);

usersApi.use("/:uid", zValidator("param", userParamsSchema));
usersApi.get("/:uid", getUser);
usersApi.patch("/:uid", zValidator("json", patchUserBodySchema), patchUser);
usersApi.delete("/:uid", deleteUser);

export default usersApi;
