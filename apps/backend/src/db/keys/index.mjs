import { eq } from "drizzle-orm";
import db from "../index.mjs";
import { keys } from "../schema.mjs";

export const KeyModel = {
  /**
   * Is a value a config key
   *
   * @param {string} value
   */
  async isValidKey(value) {
    return Boolean(
      await db.query.keys.findFirst({ where: eq(keys.value, value) }),
    );
  },

  /**
   * Get row by id
   *
   * @param {number} id
   * @returns
   */
  async getRowById(id) {
    return await db.query.keys.findFirst({ where: eq(keys.id, id) });
  },

  /**
   * Create a row
   *
   * @param {number} configId
   * @returns
   */
  async createRow(configId) {
    await db.insert(keys).values({
      configId,
    });
  },

  /**
   * Delete a row
   *
   * @param {number} id
   * @returns
   */
  async deleteRow(id) {
    await db.delete(keys).where(eq(keys.id, id));
  },
};
