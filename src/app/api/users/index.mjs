import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";

import db from "../../../db/index.mjs";
import { users } from "../../../db/schema.mjs";

const usersApi = new Hono();

// TODO: middleware that checks that user that made request
// is the same user that's resources are requested

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - users
 *     description: Get all users.
 *     responses:
 *       200:
 *         description: Returns all users.
 */
const getUsers = (c) => {
  const items = db.select().from(users).all();
  const aggregates = db
    .select({ count: sql`count(*)` })
    .from(users)
    .all();

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
 * /api/v1/users/{id}:
 *   get:
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
  const items = await db.select().from(users).where(eq(users.id, id));

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
 * /api/v1/users:
 *   post:
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

  await db.insert(users).values({ email: body.email });

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   patch:
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

  await db.update(users).set({ email: body.email }).where(eq(users.id, id));

  return new Response(undefined, { status: 204 });
};

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
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

  await db.delete(users).where(eq(users.id, id));

  return new Response(undefined, { status: 204 });
};

usersApi.get("/", getUsers);
usersApi.get("/:id", getUser);
usersApi.post("/", postUser);
usersApi.patch("/:id", patchUser);
usersApi.delete("/:id", deleteUser);

export default usersApi;
