import { eq, sql } from "drizzle-orm";
import db from "../index.mjs";
import { fields } from "../schema.mjs";

export const FieldModel = {
  /**
   * Get all rows
   */
  async getRowsByConfigId(configId) {
    const rows = await db.query.fields.findMany({
      where: eq(fields.configId, configId),
    });
    const aggregates = await db
      .select({ count: sql`count(*)` })
      .from(fields)
      .where(eq(fields.configId, configId));

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
    return await db.query.fields.findFirst({ where: eq(fields.id, id) });
  },

  /**
   * Create a row
   *
   * @param {number} configId
   * @param {string} key
   * @param {value} value
   * @returns
   */
  async createRow(configId, key, value) {
    await db.insert(fields).values({
      configId,
      key,
      value,
    });
  },

  /**
   * Update a row
   *
   * @param {number} id
   * @param {string} value
   */
  async updateRow(id, value) {
    await db.update(fields).set({ value }).where(eq(fields.id, id));
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    await db.delete(fields).where(eq(fields.id, id));
  },
};
