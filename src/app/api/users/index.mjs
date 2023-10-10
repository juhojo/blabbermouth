import { Hono } from "hono";
import { UserModel } from "../../../db/users/index.mjs";

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
 * /api/v1/users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Get a user.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a user.
 */
const getUser = async (c) => {
  const id = c.req.param("id");
  const user = await UserModel.getRowById(id);

  return c.json(
    {
      item: user,
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
const postUser = async (c) => {
  const body = await c.req.json();

  await UserModel.createRow(body.email);

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Update a user.
 *     parameters:
 *       - name: id
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
 */
const patchUser = async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  await UserModel.updateRow(id, body.email);

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - users
 *     description: Delete a user.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deleteUser = async (c) => {
  const id = c.req.param("id");

  await UserModel.deleteRow(id);

  return new Response(undefined, { status: 204 });
};

usersApi.get("/", getUsers);
usersApi.get("/:id", getUser);
usersApi.post("/", postUser);
usersApi.patch("/:id", patchUser);
usersApi.delete("/:id", deleteUser);

export default usersApi;
