import { Hono } from "hono";
import { and, desc, eq, sql } from "drizzle-orm";

import db from "../../../../db/index.mjs";
import { passcodes } from "../../../../db/schema.mjs";

const passcodesApi = new Hono();

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes:
 *   get:
 *     tags:
 *       - passcodes
 *     description: Get user's latest passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       200:
 *         description: Returns a passcode.
 */
const getLatestPasscode = async (c) => {
  const uid = c.req.param("uid");
  const items = await db
    .select()
    .from(passcodes)
    .where(eq(passcodes.userId, uid))
    .orderBy(desc(passcodes.createdAt))
    .limit(1);

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
 * /api/v1/users/{uid}/passcodes:
 *   post:
 *     tags:
 *       - passcodes
 *     description: Create a passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *     responses:
 *       201:
 *         $ref: '#/components/responses/EmptyResponse'
 */
const postPasscode = async (c) => {
  const uid = c.req.param("uid");

  await db.insert(passcodes).values({ userId: uid });

  return c.json({}, 201);
};

/**
 * @openapi
 * /api/v1/users/{uid}/passcodes/{id}:
 *   delete:
 *     tags:
 *       - passcodes
 *     description: Delete a passcode.
 *     parameters:
 *       - name: uid
 *         in: path
 *         description: User ID.
 *         required: true
 *       - name: id
 *         in: path
 *         description: Passcode ID.
 *         required: true
 *     responses:
 *       204:
 *         $ref: '#/components/responses/NoContent'
 */
const deletePasscode = async (c) => {
  const uid = c.req.param("uid");
  const id = c.req.param("id");

  await db
    .delete(passcodes)
    .where(and(eq(passcodes.id, id), eq(passcodes.userId, uid)));

  return new Response(undefined, { status: 204 });
};

passcodesApi.get("/", getLatestPasscode);
passcodesApi.post("/", postPasscode);
passcodesApi.delete("/:id", deletePasscode);

export default passcodesApi;
