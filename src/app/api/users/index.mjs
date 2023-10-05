import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";

import db from "../../../db/index.mjs";
import { users } from "../../../db/schema.mjs";

const usersApi = new Hono();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     description: Get all users.
 *     responses:
 *       200:
 *         description: Returns all users.
 */
const getUsers = (c) => {
  const items = db.select().from(users).all();
  const count = db
    .select({ count: sql`count(*)` })
    .from(users)
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
 * /api/v1/users/{id}:
 *   get:
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
  const item = await db.select().from(users).where(eq(users.id, id));

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
 * /api/v1/users:
 *   post:
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

  await db.insert(users).values({ email: body.email });

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
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
 *               passcode:
 *                 type: string
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const patchUser = async (c) => {
  const id = c.req.param("id");
  const { owner_id: ownerId } = c.body;

  await db.update(users).set({ ownerId }).where(eq(users.id, id));

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
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

  await db.delete(users).where(eq(users.id, id));

  return new Response(undefined, { status: 204 });
};

usersApi.get("/", getUsers);
usersApi.get("/:id", getUser);
usersApi.post("/", postUser);
usersApi.patch("/:id", patchUser);
usersApi.delete("/:id", deleteUser);

export default usersApi;
