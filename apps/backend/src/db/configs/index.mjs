import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { configs, keys } from "../schema.mjs";

export const ConfigModel = {
  /**
   * Get all rows
   */
  async getRowsByUserId(userId) {
    const rows = await db.query.configs.findMany({
      where: eq(configs.ownerId, userId),
    });
    const aggregates = await db
      .select({ count: sql`count(*)` })
      .from(configs)
      .where(eq(configs.ownerId, userId));

    return {
      rows,
      aggregates: {
        count: aggregates?.[0].count ?? 0,
      },
    };
  },

  /**
   * Get row by id
   *
   * @param {number} id
   * @returns
   */
  async getRowById(id) {
    return await db.query.configs.findFirst({
      where: eq(configs.id, id),
      // TODO: Add count aggregate when supported
      // see: https://orm.drizzle.team/docs/rqb#include-custom-fields
      with: { key: true, fields: true },
    });
  },

  /**
   * Create a row (and a key for the row)
   *
   * @param {number} ownerId
   * @param {string} name
   * @returns
   */
  async createRow(ownerId, name) {
    const config = (
      await db.insert(configs).values({ ownerId, name }).returning()
    )[0];
    await db.insert(keys).values({ configId: config.id });
  },

  /**
   * Update a row
   *
   * @param {number} id
   * @param {string} name
   * @returns
   */
  async updateRow(id, name) {
    await db.update(configs).set({ name }).where(eq(configs.id, id));
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    await db.delete(configs).where(eq(configs.id, id));
  },
};
